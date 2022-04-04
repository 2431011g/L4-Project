CREATE TABLE `user` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `user_name` varchar(64) NOT NULL DEFAULT '' COMMENT 'user name',
  `password` varchar(256) NOT NULL DEFAULT '' COMMENT 'password',
  `email` varchar(64) NOT NULL DEFAULT '' COMMENT 'email',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'create_time',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'update_time',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='user';


CREATE TABLE `session` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `user_id` bigint NOT NULL DEFAULT 0 COMMENT 'user id',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'create_time',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'update_time',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='session';


CREATE TABLE `tasks` (
  `task_id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `task_date` varchar(16) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT 'task create date',
  `task_name` varchar(64) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT 'task name',
  `tag` varchar(64) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT 'task tag',
  `task_status` varchar(16) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'in_progress' COMMENT 'task status',
  `complete_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'complete_time',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'create_time',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'update_time',
  `user_id` bigint NOT NULL DEFAULT 0,
  PRIMARY KEY (`task_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='tasks';


CREATE TABLE `page_log` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `user_id` bigint NOT NULL DEFAULT 0 COMMENT 'user id',
  `page_id` bigint NOT NULL DEFAULT 0 COMMENT 'page id',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'create_time',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'update_time',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='page_log';


CREATE TABLE `window_log` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `user_id` bigint NOT NULL DEFAULT 0 COMMENT 'user id',
  `content` varchar(512) NOT NULL DEFAULT '' COMMENT 'content',
  `read_time` bigint NOT NULL DEFAULT 0 COMMENT 'read_time',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'create_time',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'update_time',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='window';


CREATE TABLE `location_log` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `user_id` bigint NOT NULL DEFAULT 0 COMMENT 'user id',
  `place` varchar(512) NOT NULL DEFAULT '' COMMENT 'place',
  `longtitude` varchar(512) NOT NULL DEFAULT '' COMMENT 'longtitude',
  `latitude` varchar(512) NOT NULL DEFAULT '' COMMENT 'latitude',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'create_time',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'update_time',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='location_log';

CREATE TABLE `collect_data_log` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `user_id` bigint NOT NULL DEFAULT 0 COMMENT 'user id',
  `type` varchar(512) NOT NULL DEFAULT '' COMMENT 'type',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'create_time',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'update_time',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='collect_data_log';