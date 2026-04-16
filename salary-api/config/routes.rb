Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  get "/health", to: proc { [ 200, { "Content-Type" => "application/json" }, [ { status: "ok" }.to_json ] ] }

  namespace :api do
    namespace :v1 do
      resources :employees, only: [ :index, :show, :create, :update, :destroy ]
    end
  end
end
