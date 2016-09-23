require 'json'
require 'open-uri'

module Leaderboard
  module Ember
    # This generates a URL for an asset managed by the Ember application.
    # If EMBER_ASSETS_MANIFEST_URL is set, the fingerprinted URL generated
    # by Ember will be used.
    def self.ember_asset_url(name)
      asset_revision = assets_manifest.fetch(name, name)
      File.join(Rails.configuration.ember_assets_url, asset_revision)
    end

    private

    def self.assets_manifest
      @assets_manifest ||= begin
        url = Rails.configuration.ember_assets_manifest_url
        url.present? ? read_assets_manifest(url) : {}
      end
    end

    def self.read_assets_manifest(url)
      manifest_json = open(url) { |io| io.read }
      manifest = JSON.parse(manifest_json)
      manifest.fetch('assets', {})
    end
  end
end
