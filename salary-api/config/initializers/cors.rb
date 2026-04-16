Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # Accepts a comma-separated list so multiple origins can be whitelisted:
    #   ALLOWED_ORIGINS=https://salary-ui.vercel.app,http://localhost:5173
    allowed = ENV.fetch("ALLOWED_ORIGINS", "http://localhost:5173").split(",").map(&:strip)
    origins(*allowed)

    resource "*",
      headers: :any,
      methods: [ :get, :post, :put, :patch, :delete, :options, :head ]
  end
end
