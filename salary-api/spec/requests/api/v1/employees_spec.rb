require "rails_helper"

RSpec.describe "Api::V1::Employees", type: :request do
  let(:headers) { { "Content-Type" => "application/json" } }

  let(:valid_params) do
    {
      employee: {
        full_name:       "Jane Smith",
        job_title:       "Software Engineer",
        country:         "India",
        department:      "Engineering",
        employment_type: "full_time",
        email:           "jane.smith@example.com",
        hire_date:       "2022-01-15",
        salary:          90_000,
        currency:        "USD"
      }
    }
  end

  describe "GET /api/v1/employees" do
    before { create_list(:employee, 3) }

    it "returns 200 with a list of employees" do
      get "/api/v1/employees", headers: headers
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["data"].size).to eq(3)
    end

    it "includes pagination meta" do
      get "/api/v1/employees", headers: headers
      meta = JSON.parse(response.body)["meta"]
      expect(meta.keys).to include("current_page", "total_pages", "total_count", "per_page")
    end

    it "filters by country" do
      create(:employee, :in_india)
      create(:employee, :in_usa)
      get "/api/v1/employees?country=India", headers: headers
      names = JSON.parse(response.body)["data"].map { |e| e["attributes"]["country"] }
      expect(names).to all(eq("India"))
    end

    it "filters by search on full_name" do
      create(:employee, full_name: "Alice Unique")
      get "/api/v1/employees?search=Alice+Unique", headers: headers
      data = JSON.parse(response.body)["data"]
      expect(data.size).to eq(1)
      expect(data.first["attributes"]["full_name"]).to include("Alice Unique")
    end

    it "sorts by salary descending" do
      create(:employee, salary: 50_000)
      create(:employee, salary: 90_000)
      get "/api/v1/employees?sort_by=salary&sort_dir=desc", headers: headers
      salaries = JSON.parse(response.body)["data"].map { |e| e["attributes"]["salary"].to_f }
      expect(salaries).to eq(salaries.sort.reverse)
    end
  end

  describe "GET /api/v1/employees/:id" do
    let!(:employee) { create(:employee) }

    it "returns 200 with the employee" do
      get "/api/v1/employees/#{employee.id}", headers: headers
      expect(response).to have_http_status(:ok)
      attrs = JSON.parse(response.body)["data"]["attributes"]
      expect(attrs["full_name"]).to eq(employee.full_name)
      expect(attrs["email"]).to eq(employee.email)
    end

    it "returns 404 for an unknown id" do
      get "/api/v1/employees/999999", headers: headers
      expect(response).to have_http_status(:not_found)
      expect(JSON.parse(response.body)).to have_key("error")
    end
  end

  describe "POST /api/v1/employees" do
    it "creates an employee and returns 201" do
      expect {
        post "/api/v1/employees", params: valid_params.to_json, headers: headers
      }.to change(Employee, :count).by(1)

      expect(response).to have_http_status(:created)
      attrs = JSON.parse(response.body)["data"]["attributes"]
      expect(attrs["full_name"]).to eq("Jane Smith")
      expect(attrs["email"]).to eq("jane.smith@example.com")
    end

    it "returns 422 with errors for invalid data" do
      post "/api/v1/employees",
           params: { employee: { full_name: "" } }.to_json,
           headers: headers
      expect(response).to have_http_status(:unprocessable_entity)
      expect(JSON.parse(response.body)).to have_key("errors")
    end

    it "returns 422 for duplicate email" do
      create(:employee, email: "jane.smith@example.com")
      post "/api/v1/employees", params: valid_params.to_json, headers: headers
      expect(response).to have_http_status(:unprocessable_entity)
      expect(JSON.parse(response.body)["errors"]).to include(match(/email/i))
    end
  end

  describe "PATCH /api/v1/employees/:id" do
    let!(:employee) { create(:employee) }

    it "updates the employee and returns 200" do
      patch "/api/v1/employees/#{employee.id}",
            params: { employee: { salary: 120_000, job_title: "Senior Engineer" } }.to_json,
            headers: headers
      expect(response).to have_http_status(:ok)
      attrs = JSON.parse(response.body)["data"]["attributes"]
      expect(attrs["salary"].to_f).to eq(120_000)
      expect(attrs["job_title"]).to eq("Senior Engineer")
    end

    it "returns 404 for an unknown id" do
      patch "/api/v1/employees/999999",
            params: { employee: { salary: 100_000 } }.to_json,
            headers: headers
      expect(response).to have_http_status(:not_found)
    end

    it "returns 422 for invalid update" do
      patch "/api/v1/employees/#{employee.id}",
            params: { employee: { salary: -1 } }.to_json,
            headers: headers
      expect(response).to have_http_status(:unprocessable_entity)
    end
  end

  describe "DELETE /api/v1/employees/:id" do
    let!(:employee) { create(:employee) }

    it "deletes the employee and returns 200" do
      expect {
        delete "/api/v1/employees/#{employee.id}", headers: headers
      }.to change(Employee, :count).by(-1)

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)["message"]).to eq("Employee deleted successfully")
    end

    it "returns 404 for an unknown id" do
      delete "/api/v1/employees/999999", headers: headers
      expect(response).to have_http_status(:not_found)
    end
  end
end
