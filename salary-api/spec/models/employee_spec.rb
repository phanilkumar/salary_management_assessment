require "rails_helper"

RSpec.describe Employee, type: :model do
  describe "validations" do
    subject(:employee) { build(:employee) }

    it "is valid with valid attributes" do
      expect(employee).to be_valid
    end

    context "full_name" do
      it "is invalid when blank" do
        employee.full_name = ""
        expect(employee).not_to be_valid
        expect(employee.errors[:full_name]).to include("can't be blank")
      end

      it "is invalid when shorter than 2 characters" do
        employee.full_name = "A"
        expect(employee).not_to be_valid
      end

      it "is invalid when longer than 100 characters" do
        employee.full_name = "A" * 101
        expect(employee).not_to be_valid
      end
    end

    context "email" do
      it "is invalid when blank" do
        employee.email = ""
        expect(employee).not_to be_valid
        expect(employee.errors[:email]).to include("can't be blank")
      end

      it "is invalid with a malformed email" do
        employee.email = "not-an-email"
        expect(employee).not_to be_valid
        expect(employee.errors[:email]).to include("is invalid")
      end

      it "is invalid when duplicate (case-insensitive)" do
        create(:employee, email: "john@example.com")
        employee.email = "JOHN@example.com"
        expect(employee).not_to be_valid
        expect(employee.errors[:email]).to include("has already been taken")
      end
    end

    context "salary" do
      it "is invalid when blank" do
        employee.salary = nil
        expect(employee).not_to be_valid
      end

      it "is invalid when zero" do
        employee.salary = 0
        expect(employee).not_to be_valid
      end

      it "is invalid when negative" do
        employee.salary = -1000
        expect(employee).not_to be_valid
      end

      it "is valid with a positive value" do
        employee.salary = 75_000
        expect(employee).to be_valid
      end
    end

    context "employment_type" do
      it "is invalid with an unknown type" do
        employee.employment_type = "freelance"
        expect(employee).not_to be_valid
        expect(employee.errors[:employment_type]).to include("is not included in the list")
      end

      %w[full_time part_time contract].each do |type|
        it "is valid with '#{type}'" do
          employee.employment_type = type
          expect(employee).to be_valid
        end
      end
    end

    context "currency" do
      it "is invalid with an unsupported currency" do
        employee.currency = "XYZ"
        expect(employee).not_to be_valid
      end

      it "is valid with a supported currency" do
        employee.currency = "EUR"
        expect(employee).to be_valid
      end
    end

    %i[job_title country department hire_date].each do |field|
      it "is invalid when #{field} is blank" do
        employee.send(:"#{field}=", nil)
        expect(employee).not_to be_valid
        expect(employee.errors[field]).to include("can't be blank")
      end
    end
  end

  describe "callbacks" do
    it "downcases email before saving" do
      employee = create(:employee, email: "UPPER@EXAMPLE.COM")
      expect(employee.reload.email).to eq("upper@example.com")
    end
  end

  describe "scopes" do
    let!(:india_emp) { create(:employee, :in_india) }
    let!(:usa_emp)   { create(:employee, :in_usa) }

    describe ".by_country" do
      it "returns only employees in the given country" do
        expect(Employee.by_country("India")).to include(india_emp)
        expect(Employee.by_country("India")).not_to include(usa_emp)
      end
    end

    describe ".by_job_title" do
      it "returns employees with the given job title" do
        eng = create(:employee, job_title: "Software Engineer")
        pm  = create(:employee, job_title: "Product Manager")
        expect(Employee.by_job_title("Software Engineer")).to include(eng)
        expect(Employee.by_job_title("Software Engineer")).not_to include(pm)
      end
    end

    describe ".by_department" do
      it "returns employees in the given department" do
        eng_emp = create(:employee, department: "Engineering")
        hr_emp  = create(:employee, department: "HR")
        expect(Employee.by_department("Engineering")).to include(eng_emp)
        expect(Employee.by_department("Engineering")).not_to include(hr_emp)
      end
    end
  end
end
