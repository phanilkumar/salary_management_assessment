Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  get "/health", to: proc { [ 200, { "Content-Type" => "application/json" }, [ { status: "ok" }.to_json ] ] }
  root to: proc { [ 200, { "Content-Type" => "application/json" }, [ { status: "ok", service: "salary-management-api" }.to_json ] ] }

  namespace :api do
    namespace :v1 do
      resources :employees, only: [ :index, :show, :create, :update, :destroy ]

      namespace :insights do
        get :overview
        get :by_country
        get :by_job_title
        get :by_department
        get :by_employment_type
        get :top_paying_job_titles
        get :salary_bands
      end
    end
  end
end
