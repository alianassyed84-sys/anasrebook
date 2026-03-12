export interface DeliveryResult {
  zoneName: string;
  distanceKm: number;
  buyerCharge: number;
  logisticsCost: number;
  yourMargin: number;
  handlingFee: number;
  isFree: boolean;
  estimatedDays: string;
}

// Quick fallback coordinates if Nominatim API fails or gives empty results
const PINCODE_COORDS: Record<string, { lat: number; lng: number }> = {
  '500001': { lat: 17.3850, lng: 78.4867 }, // Hyderabad
  '600001': { lat: 13.0827, lng: 80.2707 }, // Chennai
  '380001': { lat: 23.0225, lng: 72.5714 }, // Ahmedabad
  '110001': { lat: 28.6139, lng: 77.2090 }, // Delhi
  '411001': { lat: 18.5204, lng: 73.8567 }, // Pune
};

export async function getCoordinatesFromPincode(pincode: string): Promise<{ lat: number; lng: number } | null> {
  if (PINCODE_COORDS[pincode]) {
    return PINCODE_COORDS[pincode];
  }
  
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?postalcode=${pincode}&country=india&format=json`);
    const data = await response.json();
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
    }
  } catch (error) {
    console.warn("Failed to fetch coordinates for pincode:", pincode);
  }
  return null;
}

// Haversine formula
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export function calculateDeliveryChargeByDistance(distanceKm: number, isBookPassMember: boolean): DeliveryResult {
  let result = {
    zoneName: '',
    distanceKm: parseFloat(distanceKm.toFixed(1)),
    buyerCharge: 0,
    logisticsCost: 0,
    yourMargin: 0,
    handlingFee: isBookPassMember ? 10 : 0,
    isFree: isBookPassMember,
    estimatedDays: ''
  };

  if (distanceKm <= 5) {
    result.zoneName = 'Hyper Local';
    result.buyerCharge = 25;
    result.logisticsCost = 15;
    result.yourMargin = 10;
    result.estimatedDays = '1 day';
  } else if (distanceKm <= 15) {
    result.zoneName = 'Local';
    result.buyerCharge = 40;
    result.logisticsCost = 25;
    result.yourMargin = 15;
    result.estimatedDays = '2-3 days';
  } else if (distanceKm <= 50) {
    result.zoneName = 'City';
    result.buyerCharge = 60;
    result.logisticsCost = 40;
    result.yourMargin = 20;
    result.estimatedDays = '2-3 days';
  } else if (distanceKm <= 200) {
    result.zoneName = 'Near State';
    result.buyerCharge = 90;
    result.logisticsCost = 60;
    result.yourMargin = 30;
    result.estimatedDays = '3-4 days';
  } else if (distanceKm <= 500) {
    result.zoneName = 'State';
    result.buyerCharge = 120;
    result.logisticsCost = 80;
    result.yourMargin = 40;
    result.estimatedDays = '4-5 days';
  } else {
    result.zoneName = 'Pan India';
    result.buyerCharge = 160;
    result.logisticsCost = 110;
    result.yourMargin = 50;
    result.estimatedDays = '5-7 days';
  }

  if (isBookPassMember) {
    result.buyerCharge = 0;
  }

  return result;
}

export async function calculateDeliveryCharge(vendorPincode: string, buyerPincode: string, isBookPassMember: boolean): Promise<DeliveryResult> {
  const vendorCoords = await getCoordinatesFromPincode(vendorPincode);
  const buyerCoords = await getCoordinatesFromPincode(buyerPincode);
  
  // Default to Pan India as fallback if coordinates cannot be resolved
  let distanceKm = 999;
  
  if (vendorCoords && buyerCoords) {
    distanceKm = calculateDistance(vendorCoords.lat, vendorCoords.lng, buyerCoords.lat, buyerCoords.lng);
  }

  return calculateDeliveryChargeByDistance(distanceKm, isBookPassMember);
}
