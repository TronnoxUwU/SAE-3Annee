export const deserializeTechnique = (data: any) => ({
  nomTechnique: data.nomTechnique,
  realisation: data.realisationId ? { connect: { id: data.realisationId } } : undefined,
});