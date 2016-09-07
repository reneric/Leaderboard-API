class ApplicationController < ActionController::API
  include ActionController::ImplicitRender
  include ActionController::ParamsWrapper
  respond_to :json

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
end
