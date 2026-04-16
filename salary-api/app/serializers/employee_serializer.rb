class EmployeeSerializer
  include JSONAPI::Serializer

  attributes :full_name,
             :job_title,
             :country,
             :department,
             :employment_type,
             :email,
             :hire_date,
             :salary,
             :currency,
             :created_at,
             :updated_at
end
