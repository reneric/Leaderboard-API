class AddUuidToEntries < ActiveRecord::Migration
  def change
    add_column :entries, :uuid, :uuid, default: 'uuid_generate_v4()'
  end
end
