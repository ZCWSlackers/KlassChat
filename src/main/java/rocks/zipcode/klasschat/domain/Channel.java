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
 * A Channel.
 */
@Entity
@Table(name = "channel")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Channel implements Serializable {

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

    @ManyToOne
    @JsonIgnoreProperties(value = { "users", "channels" }, allowSetters = true)
    private Workspace workspace;

    @ManyToMany
    @JoinTable(
        name = "rel_channel__user",
        joinColumns = @JoinColumn(name = "channel_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<User> users = new HashSet<>();

    @OneToMany(mappedBy = "channel")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "user", "channel" }, allowSetters = true)
    private Set<Message> messages = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Channel id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Channel name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public Channel description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Workspace getWorkspace() {
        return this.workspace;
    }

    public void setWorkspace(Workspace workspace) {
        if (this.workspace != null) {
            this.workspace.getChannels().remove(this);
        }
        this.workspace = workspace;
        if (this.workspace != null) {
            workspace.getChannels().add(this);
        }
    }

    public Channel workspace(Workspace workspace) {
        this.setWorkspace(workspace);
        return this;
    }

    public Set<User> getUsers() {
        return this.users;
    }

    public void setUsers(Set<User> users) {
        this.users = users;
    }

    public Channel users(Set<User> users) {
        this.setUsers(users);
        return this;
    }

    public Channel addUser(User user) {
        this.users.add(user);
        return this;
    }

    public Channel removeUser(User user) {
        this.users.remove(user);
        return this;
    }

    public Set<Message> getMessages() {
        return this.messages;
    }

    public void setMessages(Set<Message> messages) {
        if (this.messages != null) {
            this.messages.forEach(i -> i.setChannel(null));
        }
        if (messages != null) {
            messages.forEach(i -> i.setChannel(this));
        }
        this.messages = messages;
    }

    public Channel messages(Set<Message> messages) {
        this.setMessages(messages);
        return this;
    }

    public Channel addMessage(Message message) {
        this.messages.add(message);
        message.setChannel(this);
        return this;
    }

    public Channel removeMessage(Message message) {
        this.messages.remove(message);
        message.setChannel(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Channel)) {
            return false;
        }
        return id != null && id.equals(((Channel) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Channel{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
