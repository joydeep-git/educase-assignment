

// distance in km between two lat / lng points
// taken from -> https://stackoverflow.com/questions/18883601/function-to-calculate-distance-between-two-coordinates

export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {

  const R = 6371; // Earth radius in km

  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return parseFloat((R * c).toFixed(4)); // in km

};



// Email format validator
export const isValidEmail = (email: string): boolean => {
  const re: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return re.test(email);
};