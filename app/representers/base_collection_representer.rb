require 'representable/json'

class BaseCollectionRepresenter < Representable::Decorator
  include Representable::JSON::Collection
end
