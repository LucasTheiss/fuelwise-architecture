IF OBJECT_ID('dbo.trip','U') IS NULL
BEGIN
CREATE TABLE dbo.trip (
 id uniqueidentifier NOT NULL PRIMARY KEY,
 carrier_id uniqueidentifier NOT NULL,
 driver_id uniqueidentifier NOT NULL,
 vehicle_id uniqueidentifier NOT NULL,
 notes nvarchar(500) NOT NULL DEFAULT '',
 status varchar(20) NOT NULL DEFAULT 'IN_PROGRESS' CHECK(status IN ('IN_PROGRESS','FINISHED')),
 started_at datetime2 NOT NULL DEFAULT SYSUTCDATETIME(),
 ended_at datetime2 NULL,
 is_active bit NOT NULL DEFAULT 1,
 version int NOT NULL DEFAULT 1,
 CHECK ((status='IN_PROGRESS' AND ended_at IS NULL) OR (status='FINISHED' AND ended_at IS NOT NULL))
);
CREATE UNIQUE INDEX uq_active_trip_driver ON dbo.trip(driver_id) WHERE status='IN_PROGRESS';
CREATE UNIQUE INDEX uq_active_trip_vehicle ON dbo.trip(vehicle_id) WHERE status='IN_PROGRESS';
CREATE INDEX ix_trip_carrier ON dbo.trip(carrier_id,started_at);
END;
IF OBJECT_ID('dbo.outbox','U') IS NULL
BEGIN
CREATE TABLE dbo.outbox (
 id uniqueidentifier NOT NULL PRIMARY KEY,
 type varchar(40) NOT NULL,
 payload nvarchar(max) NOT NULL CHECK(ISJSON(payload)=1),
 occurred_at datetime2 NOT NULL DEFAULT SYSUTCDATETIME(),
 attempts int NOT NULL DEFAULT 0,
 available_at datetime2 NOT NULL DEFAULT SYSUTCDATETIME(),
 delivered_at datetime2 NULL,
 dead_letter bit NOT NULL DEFAULT 0
);
END;
IF OBJECT_ID('dbo.trip_audit','U') IS NULL
CREATE TABLE dbo.trip_audit (
 event_id uniqueidentifier NOT NULL PRIMARY KEY,
 trip_id uniqueidentifier NOT NULL,
 carrier_id uniqueidentifier NOT NULL,
 type varchar(40) NOT NULL,
 payload nvarchar(max) NOT NULL,
 processed_at datetime2 NOT NULL DEFAULT SYSUTCDATETIME()
);
