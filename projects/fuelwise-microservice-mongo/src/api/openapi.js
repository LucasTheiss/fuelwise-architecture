export const spec = {
  "openapi": "3.0.3",
  "info": {
    "title": "FuelWise Stations",
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
      }
    }
  },
  "paths": {
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
    }
  }
};
