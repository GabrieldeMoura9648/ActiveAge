CREATE DATABASE IF NOT EXISTS active_age_db;

USE active_age_db;

CREATE TABLE `usuarios` (
  `idUsuario` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `senha` VARCHAR(255) NOT NULL,
  `telefone` VARCHAR(20) NULL,
  `tipoPerfil` ENUM('PACIENTE_CUIDADOR', 'MEDICO', 'ADMIN') NOT NULL,
  `statusVerificacao` ENUM('PENDENTE', 'APROVADO', 'REPROVADO') NOT NULL DEFAULT 'PENDENTE',
  `dataCadastro` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idUsuario`),
  UNIQUE KEY `email_UNICO` (`email`)
);

CREATE TABLE `medico_detalhes` (
  `idMedicoDetalhes` INT NOT NULL AUTO_INCREMENT,
  `idUsuario` INT NOT NULL,
  `crm` VARCHAR(50) NOT NULL,
  `biografia` TEXT NULL,
  `especializacoes` TEXT NULL,
  `documentoVerificacao` VARCHAR(255) NULL,
  PRIMARY KEY (`idMedicoDetalhes`),
  UNIQUE KEY `idUsuario_UNICO` (`idUsuario`),
  CONSTRAINT `fk_medico_usuario`
    FOREIGN KEY (`idUsuario`)
    REFERENCES `usuarios` (`idUsuario`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE `horarios_disponiveis` (
  `idHorario` INT NOT NULL AUTO_INCREMENT,
  `idMedico` INT NOT NULL,
  `dataHoraInicio` DATETIME NOT NULL,
  `dataHoraFim` DATETIME NOT NULL,
  `status` ENUM('DISPONIVEL', 'AGENDADO') NOT NULL DEFAULT 'DISPONIVEL',
  PRIMARY KEY (`idHorario`),
  KEY `idx_idMedico` (`idMedico`),
  CONSTRAINT `fk_horario_medico`
    FOREIGN KEY (`idMedico`)
    REFERENCES `usuarios` (`idUsuario`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE `agendamentos` (
  `idAgendamento` INT NOT NULL AUTO_INCREMENT,
  `idPaciente` INT NOT NULL,
  `idMedico` INT NOT NULL,
  `idHorario` INT NULL,
  `dataHoraInicio` DATETIME NOT NULL,
  `dataHoraFim` DATETIME NOT NULL,
  `statusAgendamento` ENUM('PENDENTE', 'CONFIRMADO', 'CANCELADO', 'CONCLUIDO') NOT NULL DEFAULT 'PENDENTE',
  `linkSessao` VARCHAR(255) NULL,
  PRIMARY KEY (`idAgendamento`),
  KEY `idx_idPaciente` (`idPaciente`),
  KEY `idx_idMedico_agendamento` (`idMedico`),
  CONSTRAINT `fk_agendamento_paciente`
    FOREIGN KEY (`idPaciente`)
    REFERENCES `usuarios` (`idUsuario`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_agendamento_medico`
    FOREIGN KEY (`idMedico`)
    REFERENCES `usuarios` (`idUsuario`)
    ON DELETE CASCADE
);