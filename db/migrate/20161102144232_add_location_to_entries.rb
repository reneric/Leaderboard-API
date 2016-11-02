class AddLocationToEntries < ActiveRecord::Migration
  def change
    add_column :entries, :location, :string
  end
end
