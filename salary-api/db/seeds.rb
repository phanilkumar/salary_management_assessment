require "benchmark"

SEED_COUNT    = 10_000
BATCH_SIZE    = 1_000
DB_DIR        = File.expand_path(__dir__)

COUNTRIES = [
  "USA", "India", "UK", "Canada", "Australia",
  "Germany", "France", "Singapore", "Japan", "Brazil"
].freeze

DEPARTMENTS = [
  "Engineering", "Product", "Design", "Marketing",
  "Sales", "Finance", "HR", "Operations"
].freeze

EMPLOYMENT_TYPES = %w[full_time part_time contract].freeze
CURRENCIES       = %w[USD EUR GBP INR AUD CAD SGD].freeze

# Salary ranges keyed by department (min, max)
SALARY_RANGES = {
  "Engineering" => [70_000, 180_000],
  "Product"     => [80_000, 170_000],
  "Design"      => [60_000, 140_000],
  "Marketing"   => [50_000, 130_000],
  "Sales"       => [55_000, 150_000],
  "Finance"     => [65_000, 160_000],
  "HR"          => [45_000, 110_000],
  "Operations"  => [50_000, 120_000]
}.freeze

JOB_TITLES = {
  "Engineering" => [
    "Software Engineer", "Senior Software Engineer", "Staff Engineer",
    "Principal Engineer", "Engineering Manager", "DevOps Engineer",
    "QA Engineer", "Backend Engineer", "Frontend Engineer", "Data Engineer"
  ],
  "Product"     => [
    "Product Manager", "Senior Product Manager", "Director of Product",
    "Product Analyst", "Associate Product Manager"
  ],
  "Design"      => [
    "UI Designer", "UX Designer", "Product Designer",
    "Senior Designer", "Design Lead"
  ],
  "Marketing"   => [
    "Marketing Manager", "Growth Marketer", "Content Strategist",
    "SEO Specialist", "Brand Manager"
  ],
  "Sales"       => [
    "Sales Executive", "Account Manager", "Sales Manager",
    "Business Development Manager", "Enterprise Account Executive"
  ],
  "Finance"     => [
    "Financial Analyst", "Senior Analyst", "Finance Manager",
    "Controller", "CFO"
  ],
  "HR"          => [
    "HR Manager", "Recruiter", "HR Business Partner",
    "Compensation Analyst", "HR Director"
  ],
  "Operations"  => [
    "Operations Manager", "Operations Analyst", "Program Manager",
    "Supply Chain Manager", "Logistics Coordinator"
  ]
}.freeze

if Employee.count > 0
  puts "Already seeded #{Employee.count} employees, skipping."
  return
end

puts "Seeding #{SEED_COUNT} employees..."

first_names = File.readlines(File.join(DB_DIR, "first_names.txt")).map(&:chomp).reject(&:empty?)
last_names  = File.readlines(File.join(DB_DIR, "last_names.txt")).map(&:chomp).reject(&:empty?)

time = Benchmark.realtime do
  (SEED_COUNT / BATCH_SIZE).times do |batch_index|
    records = BATCH_SIZE.times.map do |i|
      index      = (batch_index * BATCH_SIZE) + i
      first_name = first_names[index % first_names.size]
      last_name  = last_names[(index * 7 + batch_index) % last_names.size]
      department = DEPARTMENTS[index % DEPARTMENTS.size]
      sal_range  = SALARY_RANGES[department]
      salary     = rand(sal_range[0]..sal_range[1]).round(-2)
      country    = COUNTRIES[index % COUNTRIES.size]
      now        = Time.current

      {
        full_name:       "#{first_name} #{last_name}",
        job_title:       JOB_TITLES[department].sample,
        country:         country,
        department:      department,
        employment_type: EMPLOYMENT_TYPES.sample,
        email:           "#{first_name.downcase}.#{last_name.downcase}.#{index}@company.com",
        hire_date:       Date.today - rand(0..3650),
        salary:          salary,
        currency:        CURRENCIES.sample,
        created_at:      now,
        updated_at:      now
      }
    end

    Employee.insert_all(records)
    print "."
  end
end

puts "\nSeeded #{Employee.count} employees in #{time.round(2)}s"
