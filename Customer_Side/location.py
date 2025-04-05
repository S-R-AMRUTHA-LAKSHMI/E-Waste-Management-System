from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from geopy.distance import geodesic

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def get_coordinates(location):
    url = "https://nominatim.openstreetmap.org/search"
    params = {"q": location, "format": "json", "limit": 1}
    headers = {"User-Agent": "e-waste-finder-script"}
    response = requests.get(url, params=params, headers=headers)
    
    if response.status_code == 200 and response.json():
        data = response.json()[0]
        return float(data['lat']), float(data['lon'])
    else:
        raise ValueError(f"Could not find coordinates for location: {location}")

def find_e_waste_companies(lat, lon, radius):
    overpass_url = "https://overpass-api.de/api/interpreter"
    overpass_query = f"""
    [out:json];
    (
      node["shop"="electronics"](around:{radius},{lat},{lon});
      way["shop"="electronics"](around:{radius},{lat},{lon});
      relation["shop"="electronics"](around:{radius},{lat},{lon});
      node["recycling:electrical_appliances"="yes"](around:{radius},{lat},{lon});
      way["recycling:electrical_appliances"="yes"](around:{radius},{lat},{lon});
      relation["recycling:electrical_appliances"="yes"](around:{radius},{lat},{lon});
    );
    out center;
    """
    response = requests.get(overpass_url, params={"data": overpass_query})
    
    if response.status_code == 200:
        return response.json().get("elements", [])
    else:
        raise ValueError(f"Error querying Overpass API: {response.status_code}")

def filter_results_by_min_distance(results, user_lat, user_lon):
    for result in results:
        lat = result.get("lat", result.get("center", {}).get("lat"))
        lon = result.get("lon", result.get("center", {}).get("lon"))
        
        if lat and lon:
            result['distance'] = geodesic((user_lat, user_lon), (lat, lon)).km
        else:
            result['distance'] = float('inf')
    
    return sorted(results, key=lambda x: x['distance'])[:3]

@app.route('/api/e-waste-companies', methods=['GET'])
def get_e_waste_companies():
    location = request.args.get('location')
    if not location:
        return jsonify({"error": "Location parameter is required"}), 400

    try:
        lat, lon = get_coordinates(location)
        radius = 1000  # Start search with 1km radius
        max_radius = 50000

        companies = []
        while not companies and radius <= max_radius:
            companies = find_e_waste_companies(lat, lon, radius)
            radius *= 2  # Expand the search radius if no companies are found

        nearest_companies = filter_results_by_min_distance(companies, lat, lon)

        formatted_companies = [
            {
                'name': company.get('tags', {}).get('name', 'Unnamed'),
                'type': company.get('tags', {}).get('shop', 'Unknown'),
                'latitude': company.get('lat', company.get('center', {}).get('lat')),
                'longitude': company.get('lon', company.get('center', {}).get('lon')),
                'distance_km': round(company.get('distance', 0), 2)
            }
            for company in nearest_companies
        ]

        return jsonify(formatted_companies)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)