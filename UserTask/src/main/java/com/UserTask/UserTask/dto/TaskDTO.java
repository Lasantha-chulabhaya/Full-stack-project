package com.UserTask.UserTask.dto;

//import com.UserTask.UserTask.entity.User;
//import jakarta.persistence.Column;
//import jakarta.persistence.FetchType;
//import jakarta.persistence.JoinColumn;
//import jakarta.persistence.ManyToOne;
//import lombok.AllArgsConstructor;
//import lombok.Data;
//import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
//@AllArgsConstructor
//@NoArgsConstructor
//@Data
public class TaskDTO {
    private int TaskId;
    private String TaskName;
    private LocalDateTime LastUpDate;
    private LocalDateTime DueDate;
    private boolean IsDueToday;

    public TaskDTO() {
    }

    public TaskDTO(int taskId, String taskName, LocalDateTime lastUpDate, LocalDateTime dueDate, boolean isDueToday) {
        TaskId = taskId;
        TaskName = taskName;
        LastUpDate = lastUpDate;
        DueDate = dueDate;
        IsDueToday = isDueToday;
    }

    public int getTaskId() {
        return TaskId;
    }

    public void setTaskId(int taskId) {
        TaskId = taskId;
    }

    public String getTaskName() {
        return TaskName;
    }

    public void setTaskName(String taskName) {
        TaskName = taskName;
    }

    public LocalDateTime getLastUpDate() {
        return LastUpDate;
    }

    public void setLastUpDate(LocalDateTime lastUpDate) {
        LastUpDate = lastUpDate;
    }

    public LocalDateTime getDueDate() {
        return DueDate;
    }

    public void setDueDate(LocalDateTime dueDate) {
        DueDate = dueDate;
    }

    public boolean isDueToday() {
        return IsDueToday;
    }

    public void setDueToday(boolean dueToday) {
        IsDueToday = dueToday;
    }
}
