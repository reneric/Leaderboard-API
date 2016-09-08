class EntriesController < ApplicationController
  wrap_parameters format: [:json]
  before_action :set_subject
  before_action :set_representer, only: [:index, :show, :update, :create]
  before_filter :set_headers, only: :index

  def index
    respond_with(@representer)
  end

  def show
    respond_with(@representer)
  end

  def create
    @entry = @representer.from_hash(params)
    if @entry.save
      render_create_success(entry_path(@entry))
    else
      render json: @entry.errors, status: :unprocessable_entity
    end
  end

  def update
    @entry = @representer.from_hash(params)
    if @entry.save
      head :no_content
    else
      render json: @entry.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @entry.destroy
    head :no_content
  end

  private

    def set_subject
      @subject =
        case current_action
        when *find_actions
          @entry = load_entry
        when *build_actions
          puts build_entry.inspect
          @entry = build_entry
        when *group_actions
          @entries = load_entries
        end
    end

    def set_representer
      @representer =
        if @subject.is_a?(Entry)
          EntryRepresenter.new(@subject)
        else
          EntryCollectionRepresenter.new(@subject)
        end
    end

    def load_entry
      @entry = Entry.find(params[:id])
    end

    def build_entry
      Entry.new
    end

    def load_entries
      if order_by_params_valid?
        Entry.order("#{translated_params[:order_by]} #{sort_direction || 'DESC'}")
      else
        Entry.order(score: :desc)
      end
    end

    def set_headers
      response.headers['X-Total-Count'] = @entries.count.to_s
    end

    def sort_direction
      if params[:direction] and %(ASC DESC).include? params[:direction].upcase
        params[:direction].upcase
      end
    end

    def order_by_params_valid?
      if translated_params[:order_by]
        %(name email score created_at).include? translated_params[:order_by]
      end
    end

    def translated_params
      {
        order_by: params[:orderBy]
      }
    end
end
