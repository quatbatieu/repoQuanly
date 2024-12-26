
export const getListPosition = (translation) => {
  return (
    [
      {
        value: translation("management.select.position", {
          position: 1
        }),
        label: translation("management.select.position", {
          position: 1
        })
      },
      {
        value: translation("management.select.position", {
          position: 2
        }),
        label: translation("management.select.position", {
          position: 2
        })
      },
      {
        value: translation("management.select.position", {
          position: 3
        }),
        label: translation("management.select.position", {
          position: 3
        })
      },
      {
        value: translation("management.select.position", {
          position: 4
        }),
        label: translation("management.select.position", {
          position: 4
        })
      },
      {
        value: translation("management.select.position", {
          position: 5
        }),
        label: translation("management.select.position", {
          position: 5
        })
      },
      {
        value: translation("management.select.position", {
          position: 6
        }),
        label: translation("management.select.position", {
          position: 6
        })
      }
    ]
  )
}

export const getListInCharge = (translation) => {
  return (
    [
      {
        value: translation("management.select.inChargeText"),
        label: translation("management.select.inChargeText")
      },
      {
        value: translation("management.select.inCharge", {
          number: 1
        }),
        label: translation("management.select.inCharge", {
          number: 1
        })
      },
      {
        value: translation("management.select.inCharge", {
          number: 2
        }),
        label: translation("management.select.inCharge", {
          number: 2
        })
      },
      {
        value: translation("management.select.inCharge", {
          number: 3
        }),
        label: translation("management.select.inCharge", {
          number: 3
        })
      },
      {
        value: translation("management.select.inCharge", {
          number: 4
        }),
        label: translation("management.select.inCharge", {
          number: 4
        })
      },
      {
        value: translation("management.select.inCharge", {
          number: 5
        }),
        label: translation("management.select.inCharge", {
          number: 5
        })
      },
      {
        value: translation("management.select.feeKD"),
        label: translation("management.select.feeKD")
      },
      {
        value: translation("management.select.roadFee"),
        label: translation("management.select.roadFee")
      },
      {
        value: translation("management.select.insurance"),
        label: translation("management.select.insurance")
      },
      {
        value: translation("management.select.photo"),
        label: translation("management.select.photo")
      },
      {
        value: translation("management.select.carPhoto"),
        label: translation("management.select.carPhoto")
      },
      {
        value: translation("management.select.invoice"),
        label: translation("management.select.invoice")
      },
      {
        value: translation("management.select.certPrint"),
        label: translation("management.select.certPrint")
      },
      {
        value: translation("management.select.createVehicleProfile"),
        label: translation("management.select.createVehicleProfile")
      },
      {
        value: translation("management.select.returnInspectionProfile"),
        label: translation("management.select.returnInspectionProfile")
      },
      {
        value: translation("management.select.administrativeAssistant"),
        label: translation("management.select.administrativeAssistant")
      },
      {
        value: translation("management.select.profileManagementRoom"),
        label: translation("management.select.profileManagementRoom")
      }
    ]
  )
} 

export const DOCUMENT_TYPE = {
  SIGNATURE : 1 , // Mẫu chữ ký
  PROFILE : 2 // hồ sơ cá nhân
}