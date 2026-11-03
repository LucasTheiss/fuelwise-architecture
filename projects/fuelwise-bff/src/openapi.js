export const spec = {
  "openapi": "3.0.3",
  "info": {
    "title": "FuelWise BFF",
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
        "scheme": "bearer"
      }
    },
    "schemas": {
      "StationInput": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "name",
          "address",
          "latitude",
          "longitude"
        ],
        "properties": {
          "name": {
            "type": "string",
            "minLength": 2,
            "maxLength": 150
          },
          "address": {
            "type": "string",
            "minLength": 5,
            "maxLength": 300
          },
          "latitude": {
            "type": "number",
            "minimum": -90,
            "maximum": 90
          },
          "longitude": {
            "type": "number",
            "minimum": -180,
            "maximum": 180
          },
          "isAffiliated": {
            "type": "boolean",
            "default": false
          }
        }
      },
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
      "station": {
        "type": "object",
        "required": [
          "id",
          "name",
          "address",
          "latitude",
          "longitude",
          "is_active"
        ],
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid"
          },
          "name": {
            "type": "string"
          },
          "address": {
            "type": "string"
          },
          "latitude": {
            "type": "number"
          },
          "longitude": {
            "type": "number"
          },
          "is_affiliated": {
            "type": "boolean"
          },
          "is_active": {
            "type": "boolean"
          },
          "created_at": {
            "type": "string",
            "format": "date-time"
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
    "/aggregated-data": {
      "get": {
        "summary": "Postos + viagens + Function (amostra até 100 de cada)",
        "responses": {
          "200": {
            "description": "Agregado completo",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "stations": {
                      "type": "array",
                      "items": {
                        "type": "object"
                      }
                    },
                    "trips": {
                      "type": "array",
                      "items": {
                        "type": "object"
                      }
                    },
                    "analytics": {
                      "type": "object"
                    },
                    "degraded": {
                      "type": "boolean"
                    },
                    "errors": {
                      "type": "object"
                    }
                  }
                }
              }
            }
          },
          "207": {
            "description": "Agregado parcial; serviços indisponíveis são null"
          },
          "401": {
            "description": "Não autenticado"
          },
          "403": {
            "description": "Perfil não permitido"
          }
        }
      }
    },
    "/api/v1/stations": {
      "post": {
        "summary": "create station",
        "parameters": [],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "name",
                  "address",
                  "latitude",
                  "longitude"
                ],
                "properties": {
                  "name": {
                    "type": "string",
                    "minLength": 2,
                    "maxLength": 150
                  },
                  "address": {
                    "type": "string",
                    "minLength": 5,
                    "maxLength": 300
                  },
                  "latitude": {
                    "type": "number",
                    "minimum": -90,
                    "maximum": 90
                  },
                  "longitude": {
                    "type": "number",
                    "minimum": -180,
                    "maximum": 180
                  },
                  "isAffiliated": {
                    "type": "boolean",
                    "default": false
                  }
                }
              },
              "example": {
                "name": "Posto Demo",
                "address": "Rua Exemplo 123",
                "latitude": -25.43,
                "longitude": -49.27,
                "isAffiliated": true
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
                    "station": {
                      "type": "object",
                      "required": [
                        "id",
                        "name",
                        "address",
                        "latitude",
                        "longitude",
                        "is_active"
                      ],
                      "properties": {
                        "id": {
                          "type": "string",
                          "format": "uuid"
                        },
                        "name": {
                          "type": "string"
                        },
                        "address": {
                          "type": "string"
                        },
                        "latitude": {
                          "type": "number"
                        },
                        "longitude": {
                          "type": "number"
                        },
                        "is_affiliated": {
                          "type": "boolean"
                        },
                        "is_active": {
                          "type": "boolean"
                        },
                        "created_at": {
                          "type": "string",
                          "format": "date-time"
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
        "summary": "list station",
        "parameters": [
          {
            "name": "page",
            "in": "query",
            "schema": {
              "type": "integer",
              "default": 1
            }
          },
          {
            "name": "limit",
            "in": "query",
            "schema": {
              "type": "integer",
              "maximum": 100,
              "default": 20
            }
          },
          {
            "name": "isAffiliated",
            "in": "query",
            "schema": {
              "type": "string",
              "enum": [
                "true",
                "false"
              ]
            }
          },
          {
            "name": "latitude",
            "in": "query",
            "schema": {
              "type": "number"
            }
          },
          {
            "name": "longitude",
            "in": "query",
            "schema": {
              "type": "number"
            }
          },
          {
            "name": "radiusKm",
            "in": "query",
            "schema": {
              "type": "number"
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
                          "name",
                          "address",
                          "latitude",
                          "longitude",
                          "is_active"
                        ],
                        "properties": {
                          "id": {
                            "type": "string",
                            "format": "uuid"
                          },
                          "name": {
                            "type": "string"
                          },
                          "address": {
                            "type": "string"
                          },
                          "latitude": {
                            "type": "number"
                          },
                          "longitude": {
                            "type": "number"
                          },
                          "is_affiliated": {
                            "type": "boolean"
                          },
                          "is_active": {
                            "type": "boolean"
                          },
                          "created_at": {
                            "type": "string",
                            "format": "date-time"
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
    "/api/v1/stations/{id}": {
      "get": {
        "summary": "get station",
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
                    "station": {
                      "type": "object",
                      "required": [
                        "id",
                        "name",
                        "address",
                        "latitude",
                        "longitude",
                        "is_active"
                      ],
                      "properties": {
                        "id": {
                          "type": "string",
                          "format": "uuid"
                        },
                        "name": {
                          "type": "string"
                        },
                        "address": {
                          "type": "string"
                        },
                        "latitude": {
                          "type": "number"
                        },
                        "longitude": {
                          "type": "number"
                        },
                        "is_affiliated": {
                          "type": "boolean"
                        },
                        "is_active": {
                          "type": "boolean"
                        },
                        "created_at": {
                          "type": "string",
                          "format": "date-time"
                        }
                      }
                    },
                    "currentPrices": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "id": {
                            "type": "string",
                            "format": "uuid"
                          },
                          "station_id": {
                            "type": "string",
                            "format": "uuid"
                          },
                          "fuel_type": {
                            "type": "string"
                          },
                          "price_per_liter": {
                            "type": "string",
                            "example": "6.199"
                          },
                          "effective_from": {
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
        "summary": "update station",
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
                  "name",
                  "address",
                  "latitude",
                  "longitude"
                ],
                "properties": {
                  "name": {
                    "type": "string",
                    "minLength": 2,
                    "maxLength": 150
                  },
                  "address": {
                    "type": "string",
                    "minLength": 5,
                    "maxLength": 300
                  },
                  "latitude": {
                    "type": "number",
                    "minimum": -90,
                    "maximum": 90
                  },
                  "longitude": {
                    "type": "number",
                    "minimum": -180,
                    "maximum": 180
                  },
                  "isAffiliated": {
                    "type": "boolean",
                    "default": false
                  }
                }
              },
              "example": {
                "name": "Posto Demo",
                "address": "Rua Exemplo 123",
                "latitude": -25.43,
                "longitude": -49.27,
                "isAffiliated": true
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
                    "station": {
                      "type": "object",
                      "required": [
                        "id",
                        "name",
                        "address",
                        "latitude",
                        "longitude",
                        "is_active"
                      ],
                      "properties": {
                        "id": {
                          "type": "string",
                          "format": "uuid"
                        },
                        "name": {
                          "type": "string"
                        },
                        "address": {
                          "type": "string"
                        },
                        "latitude": {
                          "type": "number"
                        },
                        "longitude": {
                          "type": "number"
                        },
                        "is_affiliated": {
                          "type": "boolean"
                        },
                        "is_active": {
                          "type": "boolean"
                        },
                        "created_at": {
                          "type": "string",
                          "format": "date-time"
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
        "summary": "delete station",
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
                    "station": {
                      "type": "object",
                      "required": [
                        "id",
                        "name",
                        "address",
                        "latitude",
                        "longitude",
                        "is_active"
                      ],
                      "properties": {
                        "id": {
                          "type": "string",
                          "format": "uuid"
                        },
                        "name": {
                          "type": "string"
                        },
                        "address": {
                          "type": "string"
                        },
                        "latitude": {
                          "type": "number"
                        },
                        "longitude": {
                          "type": "number"
                        },
                        "is_affiliated": {
                          "type": "boolean"
                        },
                        "is_active": {
                          "type": "boolean"
                        },
                        "created_at": {
                          "type": "string",
                          "format": "date-time"
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
    "/api/v1/stations/{id}/prices": {
      "get": {
        "summary": "Histórico de preços",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
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
                        "properties": {
                          "id": {
                            "type": "string",
                            "format": "uuid"
                          },
                          "station_id": {
                            "type": "string",
                            "format": "uuid"
                          },
                          "fuel_type": {
                            "type": "string"
                          },
                          "price_per_liter": {
                            "type": "string",
                            "example": "6.199"
                          },
                          "effective_from": {
                            "type": "string",
                            "format": "date-time"
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
      },
      "post": {
        "summary": "Registrar preço (ADMIN)",
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
                "required": [
                  "fuelType",
                  "pricePerLiter"
                ],
                "properties": {
                  "fuelType": {
                    "type": "string",
                    "enum": [
                      "DIESEL_S10",
                      "DIESEL_S500",
                      "GASOLINE",
                      "ETHANOL",
                      "ARLA32"
                    ]
                  },
                  "pricePerLiter": {
                    "type": "number",
                    "minimum": 0,
                    "exclusiveMinimum": true
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
                    "price": {
                      "type": "object",
                      "properties": {
                        "id": {
                          "type": "string",
                          "format": "uuid"
                        },
                        "station_id": {
                          "type": "string",
                          "format": "uuid"
                        },
                        "fuel_type": {
                          "type": "string"
                        },
                        "price_per_liter": {
                          "type": "string",
                          "example": "6.199"
                        },
                        "effective_from": {
                          "type": "string",
                          "format": "date-time"
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
    },
    "/api/v1/auth/login": {
      "post": {
        "security": [],
        "summary": "login",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "email",
                  "password"
                ],
                "properties": {
                  "email": {
                    "type": "string",
                    "format": "email"
                  },
                  "password": {
                    "type": "string"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Contrato de sessão legado",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object"
                }
              }
            }
          },
          "401": {
            "description": "Não autenticado"
          }
        }
      }
    },
    "/api/v1/auth/refresh": {
      "post": {
        "security": [],
        "summary": "refresh",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "refreshToken"
                ],
                "properties": {
                  "refreshToken": {
                    "type": "string"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Contrato de sessão legado",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object"
                }
              }
            }
          },
          "401": {
            "description": "Não autenticado"
          }
        }
      }
    },
    "/api/v1/auth/logout": {
      "post": {
        "security": [],
        "summary": "logout",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "refreshToken"
                ],
                "properties": {
                  "refreshToken": {
                    "type": "string"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Contrato de sessão legado",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object"
                }
              }
            }
          },
          "401": {
            "description": "Não autenticado"
          }
        }
      }
    },
    "/api/v1/auth/me": {
      "get": {
        "responses": {
          "200": {
            "description": "Identidade ativa",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "account": {
                      "type": "object",
                      "properties": {
                        "id": {
                          "type": "string",
                          "format": "uuid"
                        },
                        "name": {
                          "type": "string"
                        },
                        "role": {
                          "type": "string",
                          "enum": [
                            "ADMIN",
                            "MANAGER",
                            "DRIVER"
                          ]
                        },
                        "carrierId": {
                          "type": "string",
                          "format": "uuid",
                          "nullable": true
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
    }
  }
};
