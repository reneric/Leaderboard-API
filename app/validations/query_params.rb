module Validate
  class QueryParams
    include ActiveModel::Validations

    attr_accessor :order_by, :direction, :limit, :name, :email

    validate :order_by_valid?
    validate :direction_valid?

    def initialize(params={})
      @order_by  = params[:order_by]
      @direction = params[:direction]
      @limit = params[:limit]
      @name = params[:name]
      @email = params[:email]
      ActionController::Parameters.new(params)
        .permit(:order_by, :direction, :limit, :name, :email)
    end

    private
      def order_by_valid?
        if @order_by
          unless %(name email score created_at).include? @order_by
            errors.add(:query_params, 'is not a valid field name.')
          end
        end
      end

      def direction_valid?
        if @direction
          unless %(asc ASC desc DESC).include? @direction
            errors.add(:query_params, 'is not a valid direction.')
          end
        end
      end

  end
end
