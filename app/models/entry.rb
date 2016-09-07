class Entry < ActiveRecord::Base
  validates_presence_of :name, :email, :score
end
