module Api
  module V1
    class InsightsController < BaseController
      # GET /api/v1/insights/overview?country=India
      def overview
        country = params[:country].presence
        render json: { data: InsightsQuery.overview(country: country) }
      end

      # GET /api/v1/insights/by_country
      def by_country
        render json: { data: InsightsQuery.by_country }
      end

      # GET /api/v1/insights/by_job_title?country=India&job_title=Engineer
      def by_job_title
        country = params.require(:country)
        job_title = params.require(:job_title)
        render json: { data: InsightsQuery.by_job_title_in_country(country, job_title) }
      rescue ActionController::ParameterMissing => e
        render json: { error: e.message }, status: :bad_request
      end

      # GET /api/v1/insights/by_department
      def by_department
        render json: { data: InsightsQuery.by_department }
      end

      # GET /api/v1/insights/by_employment_type
      def by_employment_type
        render json: { data: InsightsQuery.by_employment_type }
      end

      # GET /api/v1/insights/top_paying_job_titles
      def top_paying_job_titles
        limit = (params[:limit] || 10).to_i.clamp(1, 50)
        render json: { data: InsightsQuery.top_paying_job_titles(limit: limit) }
      end

      # GET /api/v1/insights/salary_bands?country=India
      def salary_bands
        country = params[:country].presence
        render json: { data: InsightsQuery.salary_band_distribution(country: country) }
      end
    end
  end
end
