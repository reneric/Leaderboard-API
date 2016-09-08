class EntryCollectionItemRepresenter < BaseObjectRepresenter
  property :uuid, as: :id
  property :uri, writeable: false, exec_context: :decorator
  property :name
  property :email
  property :score

  def uri
    entry_path(represented, trailing_slash: true)
  end
end
