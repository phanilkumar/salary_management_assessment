Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  get "/health", to: proc { [ 200, { "Content-Type" => "application/json" }, [ { status: "ok" }.to_json ] ] }

  namespace :api do
    namespace :v1 do
      # Routes will be added in later phases
    end
  end
end
