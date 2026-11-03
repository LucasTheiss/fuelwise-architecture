export const spec = {
  "openapi": "3.0.3",
  "info": {
    "title": "FuelWise Trips",
    "version": "1.0.0"
  },
  "security": [
    {
      "bearerAuth": []
    }
  ],
  "components": {
    "securitySchemes": {
      "bearerAuth": {
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "JWT"
      }
    },
    "schemas": {
      "Error": {
        "type": "object",
        "required": [
          "error"
        ],
        "properties": {
          "error": {
            "type": "object",
            "required": [
              "code",
              "message"
            ],
            "properties": {
              "code": {
                "type": "string"
              },
              "message": {
                "type": "string"
              }
            }
          }
        }
      },
      "trip": {
        "type": "object",
        "required": [
          "id",
          "carrier_id",
          "driver_id",
          "vehicle_id",
          "status"
        ],
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid"
          },
          "carrier_id": {
            "type": "string",
            "format": "uuid"
          },
          "driver_id": {
            "type": "string",
            "format": "uuid"
          },
          "vehicle_id": {
            "type": "string",
            "format": "uuid"
          },
          "status": {
            "type": "string",
            "enum": [
              "IN_PROGRESS",
              "FINISHED"
            ]
          },
          "notes": {
            "type": "string"
          },
          "started_at": {
            "type": "string",
            "format": "date-time"
          },
          "ended_at": {
            "type": "string",
            "format": "date-time",
            "nullable": true
          },
          "is_active": {
            "type": "boolean"
          },
          "version": {
            "type": "integer"
          }
        }
      }
    }
  },
  "paths": {
    "/api/v1/trips": {
      "post": {
        "summary": "create (MANAGER)",
        "parameters": [],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "driverId",
                  "vehicleId"
                ],
                "properties": {
                  "driverId": {
                    "type": "string",
                    "format": "uuid"
                  },
                  "vehicleId": {
                    "type": "string",
                    "format": "uuid"
                  },
                  "notes": {
                    "type": "string",
                    "maxLength": 500
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Sucesso",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "trip": {
                      "type": "object",
                      "required": [
                        "id",
                        "carrier_id",
                        "driver_id",
                        "vehicle_id",
                        "status"
                      ],
                      "properties": {
                        "id": {
                          "type": "string",
                          "format": "uuid"
                        },
                        "carrier_id": {
                          "type": "string",
                          "format": "uuid"
                        },
                        "driver_id": {
                          "type": "string",
                          "format": "uuid"
                        },
                        "vehicle_id": {
                          "type": "string",
                          "format": "uuid"
                        },
                        "status": {
                          "type": "string",
                          "enum": [
                            "IN_PROGRESS",
                            "FINISHED"
                          ]
                        },
                        "notes": {
                          "type": "string"
                        },
                        "started_at": {
                          "type": "string",
                          "format": "date-time"
                        },
                        "ended_at": {
                          "type": "string",
                          "format": "date-time",
                          "nullable": true
                        },
                        "is_active": {
                          "type": "boolean"
                        },
                        "version": {
                          "type": "integer"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Validação inválida",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "error"
                  ],
                  "properties": {
                    "error": {
                      "type": "object",
                      "required": [
                        "code",
                        "message"
                      ],
                      "properties": {
                        "code": {
                          "type": "string"
                        },
                        "message": {
                          "type": "string"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "401": {
            "description": "Não autenticado",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "error"
                  ],
                  "properties": {
                    "error": {
                      "type": "object",
                      "required": [
                        "code",
                        "message"
                      ],
                      "properties": {
                        "code": {
                          "type": "string"
                        },
                        "message": {
                          "type": "string"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "403": {
            "description": "Perfil sem permissão",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "error"
                  ],
                  "properties": {
                    "error": {
                      "type": "object",
                      "required": [
                        "code",
                        "message"
                      ],
                      "properties": {
                        "code": {
                          "type": "string"
                        },
                        "message": {
                          "type": "string"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "404": {
            "description": "Recurso não encontrado",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "error"
                  ],
                  "properties": {
                    "error": {
                      "type": "object",
                      "required": [
                        "code",
                        "message"
                      ],
                      "properties": {
                        "code": {
                          "type": "string"
                        },
                        "message": {
                          "type": "string"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "409": {
            "description": "Conflito de estado ou exclusividade",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "error"
                  ],
                  "properties": {
                    "error": {
                      "type": "object",
                      "required": [
                        "code",
                        "message"
                      ],
                      "properties": {
                        "code": {
                          "type": "string"
                        },
                        "message": {
                          "type": "string"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "503": {
            "description": "Dependência indisponível",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "error"
                  ],
                  "properties": {
                    "error": {
                      "type": "object",
                      "required": [
                        "code",
                        "message"
                      ],
                      "properties": {
                        "code": {
                          "type": "string"
                        },
                        "message": {
                          "type": "string"
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "get": {
        "summary": "list (MANAGER,DRIVER)",
        "parameters": [
          {
            "name": "page",
            "in": "query",
            "schema": {
              "type": "integer",
              "minimum": 1,
              "default": 1
            }
          },
          {
            "name": "limit",
            "in": "query",
            "schema": {
              "type": "integer",
              "minimum": 1,
              "maximum": 100,
              "default": 20
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Sucesso",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "items": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "required": [
                          "id",
                          "carrier_id",
                          "driver_id",
                          "vehicle_id",
                          "status"
                        ],
                        "properties": {
                          "id": {
                            "type": "string",
                            "format": "uuid"
                          },
                          "carrier_id": {
                            "type": "string",
                            "format": "uuid"
                          },
                          "driver_id": {
                            "type": "string",
                            "format": "uuid"
                          },
                          "vehicle_id": {
                            "type": "string",
                            "format": "uuid"
                          },
                          "status": {
                            "type": "string",
                            "enum": [
                              "IN_PROGRESS",
                              "FINISHED"
                            ]
                          },
                          "notes": {
                            "type": "string"
                          },
                          "started_at": {
                            "type": "string",
                            "format": "date-time"
                          },
                          "ended_at": {
                            "type": "string",
                            "format": "date-time",
                            "nullable": true
                          },
                          "is_active": {
                            "type": "boolean"
                          },
                          "version": {
                            "type": "integer"
                          }
                        }
                      }
                    },
                    "page": {
                      "type": "integer"
                    },
                    "limit": {
                      "type": "integer"
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Validação inválida",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "error"
                  ],
                  "properties": {
                    "error": {
                      "type": "object",
                      "required": [
                        "code",
                        "message"
                      ],
                      "properties": {
                        "code": {
                          "type": "string"
                        },
                        "message": {
                          "type": "string"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "401": {
            "description": "Não autenticado",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "error"
                  ],
                  "properties": {
                    "error": {
                      "type": "object",
                      "required": [
                        "code",
                        "message"
                      ],
                      "properties": {
                        "code": {
                          "type": "string"
                        },
                        "message": {
                          "type": "string"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "403": {
            "description": "Perfil sem permissão",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "error"
                  ],
                  "properties": {
                    "error": {
                      "type": "object",
                      "required": [
                        "code",
                        "message"
                      ],
                      "properties": {
                        "code": {
                          "type": "string"
                        },
                        "message": {
                          "type": "string"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "404": {
            "description": "Recurso não encontrado",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "error"
                  ],
                  "properties": {
                    "error": {
                      "type": "object",
                      "required": [
                        "code",
                        "message"
                      ],
                      "properties": {
                        "code": {
                          "type": "string"
                        },
                        "message": {
                          "type": "string"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "409": {
            "description": "Conflito de estado ou exclusividade",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "error"
                  ],
                  "properties": {
                    "error": {
                      "type": "object",
                      "required": [
                        "code",
                        "message"
                      ],
                      "properties": {
                        "code": {
                          "type": "string"
                        },
                        "message": {
                          "type": "string"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "503": {
            "description": "Dependência indisponível",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "error"
                  ],
                  "properties": {
                    "error": {
                      "type": "object",
                      "required": [
                        "code",
                        "message"
                      ],
                      "properties": {
                        "code": {
                          "type": "string"
                        },
                        "message": {
                          "type": "string"
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/trips/{id}": {
      "get": {
        "summary": "get (MANAGER,DRIVER)",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Sucesso",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "trip": {
                      "type": "object",
                      "required": [
                        "id",
                        "carrier_id",
                        "driver_id",
                        "vehicle_id",
                        "status"
                      ],
                      "properties": {
                        "id": {
                          "type": "string",
                          "format": "uuid"
                        },
                        "carrier_id": {
                          "type": "string",
                          "format": "uuid"
                        },
                        "driver_id": {
                          "type": "string",
                          "format": "uuid"
                        },
                        "vehicle_id": {
                          "type": "string",
                          "format": "uuid"
                        },
                        "status": {
                          "type": "string",
                          "enum": [
                            "IN_PROGRESS",
                            "FINISHED"
                          ]
                        },
                        "notes": {
                          "type": "string"
                        },
                        "started_at": {
                          "type": "string",
                          "format": "date-time"
                        },
                        "ended_at": {
                          "type": "string",
                          "format": "date-time",
                          "nullable": true
                        },
                        "is_active": {
                          "type": "boolean"
                        },
                        "version": {
                          "type": "integer"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Validação inválida",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "error"
                  ],
                  "properties": {
                    "error": {
                      "type": "object",
                      "required": [
                        "code",
                        "message"
                      ],
                      "properties": {
                        "code": {
                          "type": "string"
                        },
                        "message": {
                          "type": "string"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "401": {
            "description": "Não autenticado",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "error"
                  ],
                  "properties": {
                    "error": {
                      "type": "object",
                      "required": [
                        "code",
                        "message"
                      ],
                      "properties": {
                        "code": {
                          "type": "string"
                        },
                        "message": {
                          "type": "string"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "403": {
            "description": "Perfil sem permissão",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "error"
                  ],
                  "properties": {
                    "error": {
                      "type": "object",
                      "required": [
                        "code",
                        "message"
                      ],
                      "properties": {
                        "code": {
                          "type": "string"
                        },
                        "message": {
                          "type": "string"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "404": {
            "description": "Recurso não encontrado",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "error"
                  ],
                  "properties": {
                    "error": {
                      "type": "object",
                      "required": [
                        "code",
                        "message"
                      ],
                      "properties": {
                        "code": {
                          "type": "string"
                        },
                        "message": {
                          "type": "string"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "409": {
            "description": "Conflito de estado ou exclusividade",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "error"
                  ],
                  "properties": {
                    "error": {
                      "type": "object",
                      "required": [
                        "code",
                        "message"
                      ],
                      "properties": {
                        "code": {
                          "type": "string"
                        },
                        "message": {
                          "type": "string"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "503": {
            "description": "Dependência indisponível",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "error"
                  ],
                  "properties": {
                    "error": {
                      "type": "object",
                      "required": [
                        "code",
                        "message"
                      ],
                      "properties": {
                        "code": {
                          "type": "string"
                        },
                        "message": {
                          "type": "string"
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "put": {
        "summary": "update (MANAGER)",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "notes"
                ],
                "properties": {
                  "notes": {
                    "type": "string",
                    "maxLength": 500
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Sucesso",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "trip": {
                      "type": "object",
                      "required": [
                        "id",
                        "carrier_id",
                        "driver_id",
                        "vehicle_id",
                        "status"
                      ],
                      "properties": {
                        "id": {
                          "type": "string",
                          "format": "uuid"
                        },
                        "carrier_id": {
                          "type": "string",
                          "format": "uuid"
                        },
                        "driver_id": {
                          "type": "string",
                          "format": "uuid"
                        },
                        "vehicle_id": {
                          "type": "string",
                          "format": "uuid"
                        },
                        "status": {
                          "type": "string",
                          "enum": [
                            "IN_PROGRESS",
                            "FINISHED"
                          ]
                        },
                        "notes": {
                          "type": "string"
                        },
                        "started_at": {
                          "type": "string",
                          "format": "date-time"
                        },
                        "ended_at": {
                          "type": "string",
                          "format": "date-time",
                          "nullable": true
                        },
                        "is_active": {
                          "type": "boolean"
                        },
                        "version": {
                          "type": "integer"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Validação inválida",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "error"
                  ],
                  "properties": {
                    "error": {
                      "type": "object",
                      "required": [
                        "code",
                        "message"
                      ],
                      "properties": {
                        "code": {
                          "type": "string"
                        },
                        "message": {
                          "type": "string"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "401": {
            "description": "Não autenticado",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "error"
                  ],
                  "properties": {
                    "error": {
                      "type": "object",
                      "required": [
                        "code",
                        "message"
                      ],
                      "properties": {
                        "code": {
                          "type": "string"
                        },
                        "message": {
                          "type": "string"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "403": {
            "description": "Perfil sem permissão",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "error"
                  ],
                  "properties": {
                    "error": {
                      "type": "object",
                      "required": [
                        "code",
                        "message"
                      ],
                      "properties": {
                        "code": {
                          "type": "string"
                        },
                        "message": {
                          "type": "string"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "404": {
            "description": "Recurso não encontrado",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "error"
                  ],
                  "properties": {
                    "error": {
                      "type": "object",
                      "required": [
                        "code",
                        "message"
                      ],
                      "properties": {
                        "code": {
                          "type": "string"
                        },
                        "message": {
                          "type": "string"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "409": {
            "description": "Conflito de estado ou exclusividade",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "error"
                  ],
                  "properties": {
                    "error": {
                      "type": "object",
                      "required": [
                        "code",
                        "message"
                      ],
                      "properties": {
                        "code": {
                          "type": "string"
                        },
                        "message": {
                          "type": "string"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "503": {
            "description": "Dependência indisponível",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "error"
                  ],
                  "properties": {
                    "error": {
                      "type": "object",
                      "required": [
                        "code",
                        "message"
                      ],
                      "properties": {
                        "code": {
                          "type": "string"
                        },
                        "message": {
                          "type": "string"
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "delete": {
        "summary": "delete (MANAGER)",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Sucesso",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "trip": {
                      "type": "object",
                      "required": [
                        "id",
                        "carrier_id",
                        "driver_id",
                        "vehicle_id",
                        "status"
                      ],
                      "properties": {
                        "id": {
                          "type": "string",
                          "format": "uuid"
                        },
                        "carrier_id": {
                          "type": "string",
                          "format": "uuid"
                        },
                        "driver_id": {
                          "type": "string",
                          "format": "uuid"
                        },
                        "vehicle_id": {
                          "type": "string",
                          "format": "uuid"
                        },
                        "status": {
                          "type": "string",
                          "enum": [
                            "IN_PROGRESS",
                            "FINISHED"
                          ]
                        },
                        "notes": {
                          "type": "string"
                        },
                        "started_at": {
                          "type": "string",
                          "format": "date-time"
                        },
                        "ended_at": {
                          "type": "string",
                          "format": "date-time",
                          "nullable": true
                        },
                        "is_active": {
                          "type": "boolean"
                        },
                        "version": {
                          "type": "integer"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Validação inválida",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "error"
                  ],
                  "properties": {
                    "error": {
                      "type": "object",
                      "required": [
                        "code",
                        "message"
                      ],
                      "properties": {
                        "code": {
                          "type": "string"
                        },
                        "message": {
                          "type": "string"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "401": {
            "description": "Não autenticado",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "error"
                  ],
                  "properties": {
                    "error": {
                      "type": "object",
                      "required": [
                        "code",
                        "message"
                      ],
                      "properties": {
                        "code": {
                          "type": "string"
                        },
                        "message": {
                          "type": "string"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "403": {
            "description": "Perfil sem permissão",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "error"
                  ],
                  "properties": {
                    "error": {
                      "type": "object",
                      "required": [
                        "code",
                        "message"
                      ],
                      "properties": {
                        "code": {
                          "type": "string"
                        },
                        "message": {
                          "type": "string"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "404": {
            "description": "Recurso não encontrado",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "error"
                  ],
                  "properties": {
                    "error": {
                      "type": "object",
                      "required": [
                        "code",
                        "message"
                      ],
                      "properties": {
                        "code": {
                          "type": "string"
                        },
                        "message": {
                          "type": "string"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "409": {
            "description": "Conflito de estado ou exclusividade",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "error"
                  ],
                  "properties": {
                    "error": {
                      "type": "object",
                      "required": [
                        "code",
                        "message"
                      ],
                      "properties": {
                        "code": {
                          "type": "string"
                        },
                        "message": {
                          "type": "string"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "503": {
            "description": "Dependência indisponível",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "error"
                  ],
                  "properties": {
                    "error": {
                      "type": "object",
                      "required": [
                        "code",
                        "message"
                      ],
                      "properties": {
                        "code": {
                          "type": "string"
                        },
                        "message": {
                          "type": "string"
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/trips/{id}/finish": {
      "patch": {
        "summary": "finish (MANAGER,DRIVER)",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Sucesso",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "trip": {
                      "type": "object",
                      "required": [
                        "id",
                        "carrier_id",
                        "driver_id",
                        "vehicle_id",
                        "status"
                      ],
                      "properties": {
                        "id": {
                          "type": "string",
                          "format": "uuid"
                        },
                        "carrier_id": {
                          "type": "string",
                          "format": "uuid"
                        },
                        "driver_id": {
                          "type": "string",
                          "format": "uuid"
                        },
                        "vehicle_id": {
                          "type": "string",
                          "format": "uuid"
                        },
                        "status": {
                          "type": "string",
                          "enum": [
                            "IN_PROGRESS",
                            "FINISHED"
                          ]
                        },
                        "notes": {
                          "type": "string"
                        },
                        "started_at": {
                          "type": "string",
                          "format": "date-time"
                        },
                        "ended_at": {
                          "type": "string",
                          "format": "date-time",
                          "nullable": true
                        },
                        "is_active": {
                          "type": "boolean"
                        },
                        "version": {
                          "type": "integer"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Validação inválida",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "error"
                  ],
                  "properties": {
                    "error": {
                      "type": "object",
                      "required": [
                        "code",
                        "message"
                      ],
                      "properties": {
                        "code": {
                          "type": "string"
                        },
                        "message": {
                          "type": "string"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "401": {
            "description": "Não autenticado",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "error"
                  ],
                  "properties": {
                    "error": {
                      "type": "object",
                      "required": [
                        "code",
                        "message"
                      ],
                      "properties": {
                        "code": {
                          "type": "string"
                        },
                        "message": {
                          "type": "string"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "403": {
            "description": "Perfil sem permissão",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "error"
                  ],
                  "properties": {
                    "error": {
                      "type": "object",
                      "required": [
                        "code",
                        "message"
                      ],
                      "properties": {
                        "code": {
                          "type": "string"
                        },
                        "message": {
                          "type": "string"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "404": {
            "description": "Recurso não encontrado",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "error"
                  ],
                  "properties": {
                    "error": {
                      "type": "object",
                      "required": [
                        "code",
                        "message"
                      ],
                      "properties": {
                        "code": {
                          "type": "string"
                        },
                        "message": {
                          "type": "string"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "409": {
            "description": "Conflito de estado ou exclusividade",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "error"
                  ],
                  "properties": {
                    "error": {
                      "type": "object",
                      "required": [
                        "code",
                        "message"
                      ],
                      "properties": {
                        "code": {
                          "type": "string"
                        },
                        "message": {
                          "type": "string"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "503": {
            "description": "Dependência indisponível",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "error"
                  ],
                  "properties": {
                    "error": {
                      "type": "object",
                      "required": [
                        "code",
                        "message"
                      ],
                      "properties": {
                        "code": {
                          "type": "string"
                        },
                        "message": {
                          "type": "string"
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/events": {
      "get": {
        "summary": "Auditoria de eventos da transportadora (MANAGER)",
        "responses": {
          "200": {
            "description": "Eventos processados",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "items": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "event_id": {
                            "type": "string",
                            "format": "uuid"
                          },
                          "trip_id": {
                            "type": "string",
                            "format": "uuid"
                          },
                          "type": {
                            "type": "string"
                          },
                          "processed_at": {
                            "type": "string",
                            "format": "date-time"
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "401": {
            "description": "Não autenticado"
          },
          "403": {
            "description": "Somente MANAGER"
          }
        }
      }
    }
  }
};
