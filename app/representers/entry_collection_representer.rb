class EntryCollectionRepresenter < BaseCollectionRepresenter
  self.representation_wrap = :entries
  items extend: EntryCollectionItemRepresenter, class: Entry
end
