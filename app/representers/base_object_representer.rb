require 'representable/json'

class BaseObjectRepresenter < Representable::Decorator
  include Representable::JSON
  include Representable::Hash
  include Representable::Hash::AllowSymbols
  include Rails.application.routes.url_helpers
  include Rails.application.routes.mounted_helpers
end
