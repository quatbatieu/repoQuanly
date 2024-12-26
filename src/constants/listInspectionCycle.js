export const listInspectionCycle = (translation) => {
  return [
    {
        label: `${translation('accreditation.noSchedule')}`,
        value: ''
    },
    {
        label: `3 ${translation('accreditation.month')}`,
        value: 3
    },
    {
        label: `6 ${translation('accreditation.month')}`,
        value: 6
    },
    {
        label: `12 ${translation('accreditation.month')}`,
        value: 12
    },
    {
        label: `18 ${translation('accreditation.month')}`,
        value: 18
    },
    {
        label: `24 ${translation('accreditation.month')}`,
        value: 24
    },
    {
        label: `30 ${translation('accreditation.month')}`,
        value: 30
    }
  ]
}