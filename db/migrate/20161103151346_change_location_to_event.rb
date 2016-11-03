class ChangeLocationToEvent < ActiveRecord::Migration
  def change
    rename_column :entries, :location, :event
  end
end
