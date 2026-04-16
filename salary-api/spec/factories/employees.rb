FactoryBot.define do
  factory :employee do
    sequence(:full_name) { |n| "#{Faker::Name.first_name} #{Faker::Name.last_name} #{n}" }
    job_title       { Faker::Job.title }
    country         { %w[USA India UK Canada Australia].sample }
    department      { %w[Engineering Product Design Marketing Sales Finance HR Operations].sample }
    employment_type { %w[full_time part_time contract].sample }
    sequence(:email) { |n| "employee#{n}@example.com" }
    hire_date       { Faker::Date.between(from: 5.years.ago, to: Date.today) }
    salary          { Faker::Number.between(from: 45_000, to: 180_000) }
    currency        { "USD" }

    trait :full_time do
      employment_type { "full_time" }
    end

    trait :contract do
      employment_type { "contract" }
    end

    trait :in_india do
      country { "India" }
    end

    trait :in_usa do
      country { "USA" }
    end
  end
end
