class EntryCollectionItemRepresenter < BaseObjectRepresenter
  property :uuid, as: :id
  property :uri, writeable: false, exec_context: :decorator
  property :name
  property :email
  property :score
  property :location

  def uri
    "/entries/#{represented.uuid}/"
  end
end
