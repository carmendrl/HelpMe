Rails.application.routes.draw do

	scope :api do
	  mount_devise_token_auth_for "User", at: "users", controllers: {
	    registrations: "registrations",
	    sessions: "sessions"
	  }

	  devise_scope :user do
			get "system/users/find", to: "registrations#find_user", as: :find_user
			post "system/users/promote", to: "registrations#promote", as: :promote
	    post "system/users/demote", to: "registrations#demote", as: :demote
			get "system/users/:user_id", to: "registrations#show", as: :user
			#post "system/users/:user_id/request_promotion", to:"registrations#request_promotion"
	  end

		resources :promotion_requests

		scope :user do
			get "questions", to: "questions#show_user_questions"
		end

	  resources :lab_sessions do
	    delete "leave", on: :member, to: "lab_session_memberships#destroy"

	    resources :questions do
	      member do
	        post "claim"
	        post "assign"

	        # Tags
	        get "tags"
	        post "tags", to: "questions#add_tag"
	        delete "tags/:tag", to: "questions#remove_tag"
	      end

	      resource :askers
	      resource :answer
	    end
	  end
	  post "lab_sessions/join/:token", to: "lab_session_memberships#create"

	  resources :courses do
	    member do
	      get "tags"
	    end

	    scope module: :courses do
	      resources :students
	    end
	  end

	  resources :tags, only: :index

	  root to: "root#index"
	end
end
