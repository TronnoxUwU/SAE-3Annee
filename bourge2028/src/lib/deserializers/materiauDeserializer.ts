export const deserializeMateriau = (data: any) => ({
  nomMateriau: data.nomMateriau,
  realisation: data.realisationId ? { connect: { id: data.realisationId } } : undefined,
});