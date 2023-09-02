package rocks.zipcode.klasschat.service.dto;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import javax.validation.constraints.*;

/**
 * A DTO for the {@link rocks.zipcode.klasschat.domain.Workspace} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class WorkspaceDTO implements Serializable {

    private Long id;

    @NotNull
    private String name;

    private String description;

    private Set<UserDTO> users = new HashSet<>();

    private Set<UserDTO> channels = new HashSet<>();

    public Set<UserDTO> getChannels() {
        return channels;
    }

    public void setChannels(Set<UserDTO> channels) {
        this.channels = channels;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<UserDTO> getUsers() {
        return users;
    }

    public void setUsers(Set<UserDTO> users) {
        this.users = users;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof WorkspaceDTO)) {
            return false;
        }

        WorkspaceDTO workspaceDTO = (WorkspaceDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, workspaceDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "WorkspaceDTO{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", users=" + getUsers() +
            "}";
    }
}
