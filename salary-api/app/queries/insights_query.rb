class InsightsQuery
  COUNTRY_CURRENCY = {
    "USA"       => "USD",
    "India"     => "INR",
    "UK"        => "GBP",
    "Canada"    => "CAD",
    "Australia" => "AUD",
    "Germany"   => "EUR",
    "France"    => "EUR",
    "Singapore" => "SGD",
    "Japan"     => "JPY",
    "Brazil"    => "BRL"
  }.freeze

  SALARY_BANDS = [
    { label: "Below $50k",    min: 0,       max: 50_000 },
    { label: "$50k–$100k",   min: 50_000,  max: 100_000 },
    { label: "$100k–$150k",  min: 100_000, max: 150_000 },
    { label: "Above $150k",   min: 150_000, max: Float::INFINITY }
  ].freeze

  CURRENCY_SALARY_BANDS = {
    "USD" => [
      { label: "Below $50k",    min: 0,       max: 50_000 },
      { label: "$50k–$100k",   min: 50_000,  max: 100_000 },
      { label: "$100k–$150k",  min: 100_000, max: 150_000 },
      { label: "Above $150k",   min: 150_000, max: Float::INFINITY }
    ],
    "INR" => [
      { label: "Below ₹500k",  min: 0,         max: 500_000 },
      { label: "₹500k–₹1M",   min: 500_000,   max: 1_000_000 },
      { label: "₹1M–₹2M",     min: 1_000_000, max: 2_000_000 },
      { label: "Above ₹2M",    min: 2_000_000, max: Float::INFINITY }
    ],
    "GBP" => [
      { label: "Below £40k",   min: 0,       max: 40_000 },
      { label: "£40k–£80k",   min: 40_000,  max: 80_000 },
      { label: "£80k–£120k",  min: 80_000,  max: 120_000 },
      { label: "Above £120k",  min: 120_000, max: Float::INFINITY }
    ],
    "EUR" => [
      { label: "Below €45k",   min: 0,       max: 45_000 },
      { label: "€45k–€90k",   min: 45_000,  max: 90_000 },
      { label: "€90k–€130k",  min: 90_000,  max: 130_000 },
      { label: "Above €130k",  min: 130_000, max: Float::INFINITY }
    ],
    "CAD" => [
      { label: "Below C$60k",    min: 0,       max: 60_000 },
      { label: "C$60k–C$110k",  min: 60_000,  max: 110_000 },
      { label: "C$110k–C$160k", min: 110_000, max: 160_000 },
      { label: "Above C$160k",   min: 160_000, max: Float::INFINITY }
    ],
    "AUD" => [
      { label: "Below A$70k",    min: 0,       max: 70_000 },
      { label: "A$70k–A$120k",  min: 70_000,  max: 120_000 },
      { label: "A$120k–A$170k", min: 120_000, max: 170_000 },
      { label: "Above A$170k",   min: 170_000, max: Float::INFINITY }
    ],
    "SGD" => [
      { label: "Below S$60k",    min: 0,       max: 60_000 },
      { label: "S$60k–S$120k",  min: 60_000,  max: 120_000 },
      { label: "S$120k–S$180k", min: 120_000, max: 180_000 },
      { label: "Above S$180k",   min: 180_000, max: Float::INFINITY }
    ],
    "JPY" => [
      { label: "Below ¥5M",  min: 0,          max: 5_000_000 },
      { label: "¥5M–¥8M",   min: 5_000_000,  max: 8_000_000 },
      { label: "¥8M–¥12M",  min: 8_000_000,  max: 12_000_000 },
      { label: "Above ¥12M", min: 12_000_000, max: Float::INFINITY }
    ],
    "BRL" => [
      { label: "Below R$100k",   min: 0,       max: 100_000 },
      { label: "R$100k–R$200k", min: 100_000, max: 200_000 },
      { label: "R$200k–R$350k", min: 200_000, max: 350_000 },
      { label: "Above R$350k",   min: 350_000, max: Float::INFINITY }
    ]
  }.freeze

  def self.by_country
    Employee
      .group(:country)
      .select(
        :country,
        "COUNT(*) AS headcount",
        "MIN(salary) AS min_salary",
        "MAX(salary) AS max_salary",
        "ROUND(AVG(salary), 2) AS avg_salary"
      )
      .order("headcount DESC")
      .map do |row|
        {
          country: row.country,
          currency: COUNTRY_CURRENCY[row.country] || "USD",
          headcount: row.headcount,
          min_salary: row.min_salary.to_f,
          max_salary: row.max_salary.to_f,
          avg_salary: row.avg_salary.to_f
        }
      end
  end

  def self.job_titles_by_country(country)
    Employee
      .where(country: country)
      .distinct
      .order(:job_title)
      .pluck(:job_title)
  end

  def self.by_job_title_in_country(country, job_title)
    result = ActiveRecord::Base.connection.select_one(
      Employee.sanitize_sql_array([<<~SQL, country, job_title])
        SELECT
          COUNT(*) AS headcount,
          MIN(salary) AS min_salary,
          MAX(salary) AS max_salary,
          ROUND(AVG(salary), 2) AS avg_salary
        FROM employees
        WHERE country = ? AND job_title = ?
      SQL
    )

    {
      country: country,
      job_title: job_title,
      currency: COUNTRY_CURRENCY[country] || "USD",
      headcount: result["headcount"].to_i,
      min_salary: result["min_salary"].to_f,
      max_salary: result["max_salary"].to_f,
      avg_salary: result["avg_salary"].to_f
    }
  end

  def self.by_department
    Employee
      .group(:department)
      .select(
        :department,
        "COUNT(*) AS headcount",
        "MIN(salary) AS min_salary",
        "MAX(salary) AS max_salary",
        "ROUND(AVG(salary), 2) AS avg_salary"
      )
      .order("avg_salary DESC")
      .map do |row|
        {
          department: row.department,
          headcount: row.headcount,
          min_salary: row.min_salary.to_f,
          max_salary: row.max_salary.to_f,
          avg_salary: row.avg_salary.to_f
        }
      end
  end

  def self.by_employment_type
    Employee
      .group(:employment_type)
      .select(
        :employment_type,
        "COUNT(*) AS headcount",
        "MIN(salary) AS min_salary",
        "MAX(salary) AS max_salary",
        "ROUND(AVG(salary), 2) AS avg_salary"
      )
      .order("headcount DESC")
      .map do |row|
        {
          employment_type: row.employment_type,
          headcount: row.headcount,
          min_salary: row.min_salary.to_f,
          max_salary: row.max_salary.to_f,
          avg_salary: row.avg_salary.to_f
        }
      end
  end

  def self.top_paying_job_titles(limit: 10)
    stats = Employee
      .group(:job_title)
      .select(:job_title, "COUNT(*) AS headcount", "ROUND(AVG(salary), 2) AS avg_salary")
      .order("avg_salary DESC")
      .limit(limit)

    titles = stats.map(&:job_title)
    return [] if titles.empty?

    dominant_currencies = Employee
      .where(job_title: titles)
      .group(:job_title, :currency)
      .select(:job_title, :currency, "COUNT(*) AS cnt")
      .group_by(&:job_title)
      .transform_values { |rows| rows.max_by { |r| r.cnt.to_i }.currency }

    stats.map do |row|
      {
        job_title: row.job_title,
        currency: dominant_currencies[row.job_title] || "USD",
        headcount: row.headcount,
        avg_salary: row.avg_salary.to_f
      }
    end
  end

  def self.salary_band_distribution(country: nil)
    scope = country.present? ? Employee.where(country: country) : Employee.all
    total = scope.count
    return [] if total.zero?

    bands = if country.present?
      currency = COUNTRY_CURRENCY[country] || "USD"
      CURRENCY_SALARY_BANDS[currency] || CURRENCY_SALARY_BANDS["USD"]
    else
      SALARY_BANDS
    end

    bands.map do |band|
      count = if band[:max] == Float::INFINITY
        scope.where("salary >= ?", band[:min]).count
      else
        scope.where("salary >= ? AND salary < ?", band[:min], band[:max]).count
      end

      {
        label: band[:label],
        count: count,
        percentage: ((count.to_f / total) * 100).round(2)
      }
    end
  end

  def self.overview(country: nil)
    if country.present?
      result = ActiveRecord::Base.connection.select_one(
        Employee.sanitize_sql_array([<<~SQL, country])
          SELECT
            COUNT(*) AS total_employees,
            MIN(salary) AS min_salary,
            MAX(salary) AS max_salary,
            ROUND(AVG(salary), 2) AS avg_salary
          FROM employees
          WHERE country = ?
        SQL
      )
      {
        total_employees: result["total_employees"].to_i,
        min_salary: result["min_salary"].to_f,
        max_salary: result["max_salary"].to_f,
        avg_salary: result["avg_salary"].to_f,
        currency: COUNTRY_CURRENCY[country] || "USD"
      }
    else
      result = ActiveRecord::Base.connection.select_one(<<~SQL)
        SELECT
          COUNT(*) AS total_employees,
          MIN(salary) AS min_salary,
          MAX(salary) AS max_salary,
          ROUND(AVG(salary), 2) AS avg_salary
        FROM employees
      SQL
      {
        total_employees: result["total_employees"].to_i,
        min_salary: result["min_salary"].to_f,
        max_salary: result["max_salary"].to_f,
        avg_salary: result["avg_salary"].to_f
      }
    end
  end
end
