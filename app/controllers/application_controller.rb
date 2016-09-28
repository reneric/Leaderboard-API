class ApplicationController < ActionController::API
  include ActionController::HttpAuthentication::Token::ControllerMethods
  include ActionController::ImplicitRender
  include ActionController::ParamsWrapper
  # before_action :authenticate
  respond_to :json
  TOKEN = Rails.configuration.api_authorization_token

  class_attribute :build_actions, instance_writer: false
  self.build_actions = %w(new create)

  class_attribute :find_actions, instance_writer: false
  self.find_actions = %w(show edit update destroy)

  class_attribute :group_actions, instance_writer: false
  self.group_actions = %w(index)

  def current_action
    @current_action ||= ActiveSupport::StringInquirer.new(params[:action])
  end

  def render_create_success(location)
    render_success(
      'Entry successfully created.',
      location: location,
      status: 201
    )
  end

  def render_success(message, status: 200, location: nil)
    render(
      json: { status: status, message: message },
      location: location,
      status: status
    )
  end

  def render_error(message, errors: [], status: 422)
    render(
      json: { status: status, message: message, errors: errors },
      status: status
    )
  end

  protected
    def authenticate
      authenticate_token || render_unauthorized
    end

    def authenticate_token
      authenticate_with_http_token do |token, options|
        ActiveSupport::SecurityUtils.secure_compare(
          ::Digest::SHA256.hexdigest(token),
          ::Digest::SHA256.hexdigest(TOKEN)
        )
      end || params[:token] == TOKEN
    end

    def render_unauthorized
      render_error("Unauthorized: Invalid Token", errors: ["Authorization error"], status: 401)
    end
end
