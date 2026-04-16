module Api
  module V1
    class BaseController < ApplicationController
      rescue_from ActiveRecord::RecordNotFound, with: :not_found
      rescue_from ActiveRecord::RecordInvalid, with: :unprocessable_entity

      private

      def not_found(error)
        render json: { error: error.message }, status: :not_found
      end

      def unprocessable_entity(error)
        render json: { errors: error.record.errors.full_messages }, status: :unprocessable_entity
      end
    end
  end
end
