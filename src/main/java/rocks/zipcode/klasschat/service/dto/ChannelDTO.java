package rocks.zipcode.klasschat.service.dto;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import javax.validation.constraints.*;

/**
 * A DTO for the {@link rocks.zipcode.klasschat.domain.Channel} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ChannelDTO implements Serializable {

    private Long id;

    @NotNull
    private String name;

    private String description;

    private WorkspaceDTO workspace;

    private Set<UserDTO> users = new HashSet<>();

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

    public WorkspaceDTO getWorkspace() {
        return workspace;
    }

    public void setWorkspace(WorkspaceDTO workspace) {
        this.workspace = workspace;
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
        if (!(o instanceof ChannelDTO)) {
            return false;
        }

        ChannelDTO channelDTO = (ChannelDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, channelDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ChannelDTO{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", workspace=" + getWorkspace() +
            ", users=" + getUsers() +
            "}";
    }
}
