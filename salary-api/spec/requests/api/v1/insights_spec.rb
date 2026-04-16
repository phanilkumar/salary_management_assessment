require "rails_helper"

RSpec.describe "Api::V1::Insights", type: :request do
  let(:headers) { { "Content-Type" => "application/json" } }

  before do
    create(:employee, country: "India",  salary: 80_000,  job_title: "Software Engineer", department: "Engineering", employment_type: "full_time")
    create(:employee, country: "India",  salary: 100_000, job_title: "Software Engineer", department: "Engineering", employment_type: "contract")
    create(:employee, country: "USA",    salary: 120_000, job_title: "Product Manager",   department: "Product",     employment_type: "full_time")
    create(:employee, country: "USA",    salary: 140_000, job_title: "Engineering Manager", department: "Engineering", employment_type: "full_time")
  end

  describe "GET /api/v1/insights/overview" do
    it "returns 200 with global salary stats" do
      get "/api/v1/insights/overview", headers: headers
      expect(response).to have_http_status(:ok)
      data = JSON.parse(response.body)["data"]
      expect(data["total_employees"]).to eq(4)
      expect(data["min_salary"]).to eq(80_000)
      expect(data["max_salary"]).to eq(140_000)
      expect(data["avg_salary"]).to eq(110_000)
    end
  end

  describe "GET /api/v1/insights/by_country" do
    it "returns 200 with stats grouped by country" do
      get "/api/v1/insights/by_country", headers: headers
      expect(response).to have_http_status(:ok)
      data = JSON.parse(response.body)["data"]
      countries = data.map { |d| d["country"] }
      expect(countries).to include("India", "USA")

      india = data.find { |d| d["country"] == "India" }
      expect(india["headcount"]).to eq(2)
      expect(india["avg_salary"]).to eq(90_000)
    end
  end

  describe "GET /api/v1/insights/by_job_title" do
    it "returns 200 with stats for a job title in a country" do
      get "/api/v1/insights/by_job_title?country=India&job_title=Software+Engineer", headers: headers
      expect(response).to have_http_status(:ok)
      data = JSON.parse(response.body)["data"]
      expect(data["country"]).to eq("India")
      expect(data["job_title"]).to eq("Software Engineer")
      expect(data["headcount"]).to eq(2)
      expect(data["avg_salary"]).to eq(90_000)
    end

    it "returns 400 when country param is missing" do
      get "/api/v1/insights/by_job_title?job_title=Software+Engineer", headers: headers
      expect(response).to have_http_status(:bad_request)
    end

    it "returns 400 when job_title param is missing" do
      get "/api/v1/insights/by_job_title?country=India", headers: headers
      expect(response).to have_http_status(:bad_request)
    end
  end

  describe "GET /api/v1/insights/by_department" do
    it "returns 200 with stats grouped by department" do
      get "/api/v1/insights/by_department", headers: headers
      expect(response).to have_http_status(:ok)
      data = JSON.parse(response.body)["data"]
      departments = data.map { |d| d["department"] }
      expect(departments).to include("Engineering", "Product")
    end
  end

  describe "GET /api/v1/insights/by_employment_type" do
    it "returns 200 with stats grouped by employment type" do
      get "/api/v1/insights/by_employment_type", headers: headers
      expect(response).to have_http_status(:ok)
      data = JSON.parse(response.body)["data"]
      types = data.map { |d| d["employment_type"] }
      expect(types).to include("full_time", "contract")
    end
  end

  describe "GET /api/v1/insights/top_paying_job_titles" do
    it "returns 200 with job titles ordered by avg salary" do
      get "/api/v1/insights/top_paying_job_titles", headers: headers
      expect(response).to have_http_status(:ok)
      data = JSON.parse(response.body)["data"]
      avg_salaries = data.map { |d| d["avg_salary"] }
      expect(avg_salaries).to eq(avg_salaries.sort.reverse)
    end

    it "respects the limit param" do
      get "/api/v1/insights/top_paying_job_titles?limit=2", headers: headers
      expect(JSON.parse(response.body)["data"].size).to be <= 2
    end
  end

  describe "GET /api/v1/insights/salary_bands" do
    it "returns 200 with 4 salary bands" do
      get "/api/v1/insights/salary_bands", headers: headers
      expect(response).to have_http_status(:ok)
      data = JSON.parse(response.body)["data"]
      expect(data.size).to eq(4)
      labels = data.map { |d| d["label"] }
      expect(labels).to include("Below $50k", "$50k - $100k", "$100k - $150k", "Above $150k")
    end

    it "percentages sum to 100" do
      get "/api/v1/insights/salary_bands", headers: headers
      data = JSON.parse(response.body)["data"]
      total = data.sum { |d| d["percentage"] }
      expect(total).to be_within(0.1).of(100)
    end
  end
end
