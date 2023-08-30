package rocks.zipcode.klasschat.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Workspace.
 */
@Entity
@Table(name = "workspace")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Workspace implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description")
    private String description;

    @ManyToMany
    @JoinTable(
        name = "rel_workspace__user",
        joinColumns = @JoinColumn(name = "workspace_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<User> users = new HashSet<>();

    @OneToMany(mappedBy = "workspace")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "workspace", "users", "messages" }, allowSetters = true)
    private Set<Channel> channels = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Workspace id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Workspace name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public Workspace description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<User> getUsers() {
        return this.users;
    }

    public void setUsers(Set<User> users) {
        this.users = users;
    }

    public Workspace users(Set<User> users) {
        this.setUsers(users);
        return this;
    }

    public Workspace addUser(User user) {
        this.users.add(user);
        return this;
    }

    public Workspace removeUser(User user) {
        this.users.remove(user);
        return this;
    }

    public Set<Channel> getChannels() {
        return this.channels;
    }

    public void setChannels(Set<Channel> channels) {
        if (this.channels != null) {
            this.channels.forEach(i -> i.setWorkspace(null));
        }
        if (channels != null) {
            channels.forEach(i -> i.setWorkspace(this));
        }
        this.channels = channels;
    }

    public Workspace channels(Set<Channel> channels) {
        this.setChannels(channels);
        return this;
    }

    public Workspace addChannel(Channel channel) {
        this.channels.add(channel);
        channel.setWorkspace(this);
        return this;
    }

    public Workspace removeChannel(Channel channel) {
        this.channels.remove(channel);
        channel.setWorkspace(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Workspace)) {
            return false;
        }
        return id != null && id.equals(((Workspace) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Workspace{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
