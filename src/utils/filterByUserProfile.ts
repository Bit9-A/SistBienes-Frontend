export function filterByUserProfile<T extends { dept_id: number }>(
  data: T[],
  profile: any,
): { filtered: T[]; canFilterByDept: boolean } {
  if (!profile) {
    return { filtered: data, canFilterByDept: false };
  }
  if (
    profile.tipo_usuario === 1 ||
    profile.tipo_usuario === 5 ||
    profile.dept_nombre === 'Bienes'
  ) {
    return { filtered: data, canFilterByDept: true };
  }
  if (profile.dept_id) {
    return {
      filtered: data.filter((item) => item.dept_id === profile.dept_id),
      canFilterByDept: false,
    };
  }
  return { filtered: data, canFilterByDept: false };
}
