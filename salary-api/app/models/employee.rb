class Employee < ApplicationRecord
  EMPLOYMENT_TYPES = %w[full_time part_time contract].freeze
  CURRENCIES = %w[USD EUR GBP INR AUD CAD SGD].freeze

  validates :full_name, presence: true, length: { minimum: 2, maximum: 100 }
  validates :job_title, presence: true, length: { maximum: 100 }
  validates :country, presence: true, length: { maximum: 100 }
  validates :department, presence: true, length: { maximum: 100 }
  validates :email, presence: true,
                    uniqueness: { case_sensitive: false },
                    format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :hire_date, presence: true
  validates :salary, presence: true,
                     numericality: { greater_than: 0 }
  validates :employment_type, presence: true,
                               inclusion: { in: EMPLOYMENT_TYPES }
  validates :currency, presence: true,
                        inclusion: { in: CURRENCIES }

  before_save :downcase_email

  scope :by_country, ->(country) { where(country: country) }
  scope :by_job_title, ->(job_title) { where(job_title: job_title) }
  scope :by_department, ->(department) { where(department: department) }

  private

  def downcase_email
    self.email = email.downcase
  end
end
