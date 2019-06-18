class TextMatcherService
	def initialize
		@filter = Stopwords::Snowball::Filter.new "en
	end

end
