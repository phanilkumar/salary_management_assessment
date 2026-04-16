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
    { label: "Below $50k", min: 0, max: 50_000 },
    { label: "$50k - $100k", min: 50_000, max: 100_000 },
    { label: "$100k - $150k", min: 100_000, max: 150_000 },
    { label: "Above $150k", min: 150_000, max: Float::INFINITY }
  ].freeze

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
    Employee
      .group(:job_title)
      .select(
        :job_title,
        "COUNT(*) AS headcount",
        "ROUND(AVG(salary), 2) AS avg_salary"
      )
      .order("avg_salary DESC")
      .limit(limit)
      .map do |row|
        {
          job_title: row.job_title,
          headcount: row.headcount,
          avg_salary: row.avg_salary.to_f
        }
      end
  end

  def self.salary_band_distribution
    total = Employee.count
    return [] if total.zero?

    SALARY_BANDS.map do |band|
      count = if band[:max] == Float::INFINITY
        Employee.where("salary >= ?", band[:min]).count
      else
        Employee.where("salary >= ? AND salary < ?", band[:min], band[:max]).count
      end

      {
        label: band[:label],
        count: count,
        percentage: ((count.to_f / total) * 100).round(2)
      }
    end
  end

  def self.overview
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
