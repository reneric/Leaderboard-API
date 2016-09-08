namespace :db do
  desc 'Recreate the database.'
  task :rebuild do
    safely do
      Rake::Task['db:drop'].invoke
      Rake::Task['db:create'].invoke
      Rake::Task['db:migrate'].invoke
      Rake::Task['db:seed'].invoke
    end
  end

  def safely(&_block)
    if ::Rails.env == 'production'
      fail 'That rake task is disabled in production.'
    else
      yield
    end
  end
end
