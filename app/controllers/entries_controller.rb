class EntriesController < ApiController
  include Validate
  wrap_parameters format: [:json]
  before_action :set_subject
  before_action :set_representer, only: [:index, :show, :update, :create]
  before_action :validate_query_params, only: :index
  before_filter :set_headers, only: :index

  has_scope :by_email, as: 'email'
  has_scope :by_name, as: 'name'
  has_scope :with_limit, as: 'limit'

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
      @entry = Entry.find_by(uuid: params[:id])
    end

    def build_entry
      Entry.new
    end

    def load_entries
      @entry = apply_scopes(Entry).ordered(params[:order_by], params[:direction])
    end

    def set_headers
      response.headers['X-Total-Count'] = @entries.count.to_s
    end

    def validate_query_params
      query_params = Validate::QueryParams.new(params)
      if !query_params.valid?
        render_error("Invalid query.", errors: query_params.errors, status: 400)
      end
    end
end
