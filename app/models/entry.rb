class Entry < ActiveRecord::Base
  validates_presence_of :name, :email, :score

  scope :ordered, -> (field, direction) {
    order("#{field ? field : 'score'} #{direction ? direction.upcase : 'DESC'}")
  }
  scope :with_limit, -> (count) { limit(count.to_i) if count }
  scope :by_email, -> (email) { where("email ILIKE ?", "%#{email}%") }
  scope :by_name, -> (name) { where("name ILIKE ?", "%#{name}%") }
end
