 
export interface City {
  id: number;
  name: string;
  coordinate: GeoJSON.Geometry;
}
 
export interface Suburb {
  id: number;
  name: string;
  coordinate: GeoJSON.Geometry;
}

// GeoJSON interface (you can define more specific interfaces for different geometry types if needed)
export namespace GeoJSON {
  export type Geometry = Point | LineString | Polygon;

  export interface Point {
    type: "Point";
    coordinates: [number, number];
  }

  export interface LineString {
    type: "LineString";
    coordinates: [number, number][];
  }

  export interface Polygon {
    type: "Polygon";
    coordinates: [number, number][][];
  }
}
