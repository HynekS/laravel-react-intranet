export interface FileResponse {
  type: string
  model:
    | "teren_databaze"
    | "LAB_databaze"
    | "teren_foto"
    | "teren_scan"
    | "digitalizace_nalez"
    | "digitalizace_plany"
    | "geodet_body"
    | "geodet_plany"
  projectId: string
  fileId: number
}
