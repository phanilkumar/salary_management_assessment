module Api
  module V1
    class EmployeesController < BaseController
      before_action :set_employee, only: [ :show, :update, :destroy ]

      # GET /api/v1/employees
      def index
        employees = Employee.all
        employees = apply_filters(employees)
        employees = apply_sorting(employees)
        employees = employees.page(params[:page]).per(params[:per_page] || 20)

        render json: {
          data: EmployeeSerializer.new(employees).serializable_hash[:data],
          meta: pagination_meta(employees)
        }
      end

      # GET /api/v1/employees/:id
      def show
        render json: { data: EmployeeSerializer.new(@employee).serializable_hash[:data] }
      end

      # POST /api/v1/employees
      def create
        employee = Employee.create!(employee_params)
        render json: { data: EmployeeSerializer.new(employee).serializable_hash[:data] },
               status: :created
      end

      # PATCH /api/v1/employees/:id
      def update
        @employee.update!(employee_params)
        render json: { data: EmployeeSerializer.new(@employee).serializable_hash[:data] }
      end

      # DELETE /api/v1/employees/:id
      def destroy
        @employee.destroy!
        render json: { message: "Employee deleted successfully" }, status: :ok
      end

      private

      def set_employee
        @employee = Employee.find(params[:id])
      end

      def employee_params
        params.require(:employee).permit(
          :full_name, :job_title, :country, :department,
          :employment_type, :email, :hire_date, :salary, :currency
        )
      end

      def apply_filters(scope)
        scope = scope.by_country(params[:country]) if params[:country].present?
        scope = scope.by_job_title(params[:job_title]) if params[:job_title].present?
        scope = scope.by_department(params[:department]) if params[:department].present?
        scope = scope.where(employment_type: params[:employment_type]) if params[:employment_type].present?
        scope = scope.where("full_name ILIKE ?", "%#{params[:search]}%") if params[:search].present?
        scope
      end

      def apply_sorting(scope)
        allowed_columns = %w[full_name salary hire_date job_title country department]
        column = allowed_columns.include?(params[:sort_by]) ? params[:sort_by] : "full_name"
        direction = params[:sort_dir] == "desc" ? "desc" : "asc"
        scope.order("#{column} #{direction}")
      end

      def pagination_meta(records)
        {
          current_page: records.current_page,
          total_pages: records.total_pages,
          total_count: records.total_count,
          per_page: records.limit_value
        }
      end
    end
  end
end
